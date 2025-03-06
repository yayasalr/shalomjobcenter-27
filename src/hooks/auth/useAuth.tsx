
import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, AuthContextType, RegisterData } from "./types";
import { LocalStorageKeys } from "./authUtils";

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constantes de sécurité
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes

// Authentication provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on load
  useEffect(() => {
    const storedUser = localStorage.getItem(LocalStorageKeys.USER);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Vérifier si le compte est verrouillé
        if (parsedUser.lockedUntil && new Date(parsedUser.lockedUntil) > new Date()) {
          console.log("Compte verrouillé jusqu'à", new Date(parsedUser.lockedUntil));
          // Ne pas connecter l'utilisateur si son compte est verrouillé
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem(LocalStorageKeys.USER);
      }
    }
    setLoading(false);
  }, []);

  // Gérer les blocages de comptes
  const getLoginAttempts = (email: string) => {
    const attemptsData = localStorage.getItem(`login_attempts_${email}`);
    if (attemptsData) {
      try {
        return JSON.parse(attemptsData);
      } catch (e) {
        return { count: 0, timestamp: Date.now() };
      }
    }
    return { count: 0, timestamp: Date.now() };
  };

  const updateLoginAttempts = (email: string, increment = true) => {
    const attempts = getLoginAttempts(email);
    const now = Date.now();
    
    // Si le délai de verrouillage est passé, réinitialiser le compteur
    if (attempts.lockUntil && attempts.lockUntil < now) {
      localStorage.setItem(`login_attempts_${email}`, JSON.stringify({
        count: increment ? 1 : 0,
        timestamp: now
      }));
      return { count: increment ? 1 : 0, timestamp: now };
    }
    
    // Sinon, incrémenter le compteur
    const newCount = increment ? attempts.count + 1 : 0;
    const newData = { 
      count: newCount, 
      timestamp: now,
      lockUntil: newCount >= MAX_LOGIN_ATTEMPTS ? now + LOCKOUT_DURATION : undefined
    };
    
    localStorage.setItem(`login_attempts_${email}`, JSON.stringify(newData));
    return newData;
  };

  const checkAccountLocked = (email: string) => {
    const attempts = getLoginAttempts(email);
    if (attempts.lockUntil && attempts.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((attempts.lockUntil - Date.now()) / (60 * 1000));
      return {
        locked: true,
        remainingMinutes: remainingTime
      };
    }
    return { locked: false, remainingMinutes: 0 };
  };

  // Enhanced login function with security features
  const login = {
    mutateAsync: async (userData: any): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Vérifier si le compte est verrouillé
        const lockStatus = checkAccountLocked(userData.email);
        if (lockStatus.locked) {
          toast.error(`Compte verrouillé. Réessayez dans ${lockStatus.remainingMinutes} minutes ou contactez l'administrateur.`);
          reject(new Error("Compte verrouillé"));
          return;
        }

        // Simuler une vérification d'authentification
        setTimeout(() => {
          // Simulation d'échec d'authentification (si mot de passe incorrect)
          const isValidLogin = userData.email.includes('@') && userData.password && userData.password.length >= 6;
          
          if (!isValidLogin) {
            const attempts = updateLoginAttempts(userData.email);
            
            if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
              toast.error(`Trop de tentatives échouées. Compte verrouillé pour 1 heure.`);
              
              // Enregistrer cette tentative dans les logs de sécurité
              const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
              securityLogs.push({
                type: 'account_locked',
                email: userData.email,
                timestamp: new Date().toISOString(),
                ipAddress: 'client-side',
                userAgent: navigator.userAgent
              });
              localStorage.setItem('security_logs', JSON.stringify(securityLogs));
              
              reject(new Error("Compte verrouillé après trop de tentatives"));
            } else {
              toast.error(`Identifiants incorrects. ${MAX_LOGIN_ATTEMPTS - attempts.count} tentative(s) restante(s).`);
              reject(new Error("Identifiants incorrects"));
            }
            return;
          }
          
          // En cas de succès, réinitialiser le compteur de tentatives
          updateLoginAttempts(userData.email, false);
          
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: userData.email,
            name: userData.email.split('@')[0],
            role: userData.email.includes('admin') ? 'admin' : 'user',
            isAdmin: userData.email.includes('admin'),
            lastLogin: new Date().toISOString(),
            loginCount: 1,
            securityLevel: 'standard'
          };
          
          // Incrémenter le compteur de connexions
          const existingUser = localStorage.getItem(LocalStorageKeys.USER);
          if (existingUser) {
            try {
              const parsed = JSON.parse(existingUser);
              if (parsed.email === userData.email) {
                newUser.loginCount = (parsed.loginCount || 0) + 1;
              }
            } catch (e) {
              console.error("Erreur lors de la récupération des données utilisateur", e);
            }
          }
          
          setUser(newUser);
          localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(newUser));
          
          // Journaliser la connexion réussie
          const loginLogs = JSON.parse(localStorage.getItem('login_logs') || '[]');
          loginLogs.push({
            userId: newUser.id,
            email: newUser.email,
            timestamp: new Date().toISOString(),
            device: navigator.userAgent,
            success: true
          });
          localStorage.setItem('login_logs', JSON.stringify(loginLogs));
          
          toast.success("Connexion réussie!");
          navigate(newUser.isAdmin ? "/admin" : "/");
          resolve();
        }, 500);
      });
    },
    isPending: false
  };

  // Mock register function with increased security
  const register = {
    mutateAsync: async (data: RegisterData): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Vérifier si l'email est déjà utilisé
        const existingUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
        const emailExists = existingUsers.some((u: any) => u.email === data.email);
        
        if (emailExists) {
          toast.error("Cet email est déjà utilisé");
          reject(new Error("Email déjà utilisé"));
          return;
        }
        
        setTimeout(() => {
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: data.email,
            name: data.name,
            role: 'user',
            created: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            loginCount: 1,
            securityLevel: 'standard'
          };
          
          // Ajouter l'utilisateur à la liste des utilisateurs
          existingUsers.push(newUser);
          localStorage.setItem('all_users', JSON.stringify(existingUsers));
          
          registerUser(newUser);
          
          // Journaliser la création de compte
          const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
          securityLogs.push({
            type: 'account_created',
            userId: newUser.id,
            email: newUser.email,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          });
          localStorage.setItem('security_logs', JSON.stringify(securityLogs));
          
          resolve();
        }, 500);
      });
    },
    isPending: false
  };

  // Enhanced logout function with security logging
  const logout = () => {
    try {
      // Journaliser la déconnexion
      if (user) {
        const logoutLogs = JSON.parse(localStorage.getItem('login_logs') || '[]');
        logoutLogs.push({
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString(),
          device: navigator.userAgent,
          action: 'logout'
        });
        localStorage.setItem('login_logs', JSON.stringify(logoutLogs));
      }
      
      // Remove user from state
      setUser(null);
      
      // Remove data from localStorage
      localStorage.removeItem(LocalStorageKeys.USER);
      
      // Notify user of success
      toast.success("Déconnexion réussie");
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const registerUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(userData));
    toast.success("Inscription réussie!");
    navigate("/");
  };

  // Admin functions for security management
  const unlockUserAccount = (email: string) => {
    if (!user?.isAdmin) {
      toast.error("Seul un administrateur peut effectuer cette action");
      return false;
    }
    
    localStorage.removeItem(`login_attempts_${email}`);
    
    // Journaliser le déverrouillage de compte
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push({
      type: 'account_unlocked',
      adminId: user.id,
      targetEmail: email,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    
    toast.success(`Compte ${email} déverrouillé avec succès`);
    return true;
  };

  const updateUserSecurityLevel = (userId: string, level: 'standard' | 'high' | 'restricted') => {
    if (!user?.isAdmin) {
      toast.error("Seul un administrateur peut effectuer cette action");
      return false;
    }
    
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
    const updatedUsers = allUsers.map((u: any) => {
      if (u.id === userId) {
        return { ...u, securityLevel: level };
      }
      return u;
    });
    
    localStorage.setItem('all_users', JSON.stringify(updatedUsers));
    
    // Journaliser la modification du niveau de sécurité
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push({
      type: 'security_level_changed',
      adminId: user.id,
      targetUserId: userId,
      newLevel: level,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    
    toast.success(`Niveau de sécurité mis à jour pour l'utilisateur`);
    return true;
  };

  // Update user avatar
  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(updatedUser));
    }
  };

  // Mock session refresh with security checks
  const refreshSession = () => {
    console.log("Refreshing user session");
    // Dans une application réelle, cela validerait les jetons JWT, etc.
    
    // Vérification supplémentaire de sécurité (exemple: empreinte du navigateur)
    if (user) {
      const browserFingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
      const storedFingerprint = localStorage.getItem(`fingerprint_${user.id}`);
      
      if (!storedFingerprint) {
        localStorage.setItem(`fingerprint_${user.id}`, browserFingerprint);
      } else if (storedFingerprint !== browserFingerprint) {
        // Potentielle utilisation suspecte détectée
        console.warn("Empreinte de navigateur modifiée, potentielle session compromise");
        
        // Journaliser la tentative suspecte
        const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        securityLogs.push({
          type: 'suspicious_session',
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString(),
          expectedFingerprint: storedFingerprint,
          actualFingerprint: browserFingerprint
        });
        localStorage.setItem('security_logs', JSON.stringify(securityLogs));
      }
    }
  };

  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = !!user?.isAdmin;
  const isLoading = loading;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      isLoading,
      isAuthenticated,
      isAdmin,
      login, 
      logout, 
      registerUser,
      register,
      refreshSession,
      updateUserAvatar,
      // Nouvelles fonctions de sécurité
      unlockUserAccount,
      updateUserSecurityLevel,
      checkAccountLocked
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
