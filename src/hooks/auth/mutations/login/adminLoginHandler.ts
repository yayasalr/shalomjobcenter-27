
import { User } from "../../types";
import { toast } from "sonner";
import CryptoJS from "crypto-js";
import { LocalStorageKeys } from "../../constants";
import { NavigateFunction } from "react-router-dom";

/**
 * Handle admin login attempt
 */
export const handleAdminLogin = (
  userData: { email: string; password: string },
  adminCreds: string | null,
  updateLoginAttempts: (email: string, increment?: boolean) => { count: number; timestamp: number },
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsPending: (value: boolean) => void,
  navigate: NavigateFunction,
  resolve: (value: User | void) => void,
  reject: (reason: Error) => void
): boolean => {
  if (!adminCreds) return false;
  
  try {
    const adminData = JSON.parse(adminCreds);
    // Check if this is the admin trying to log in
    if (userData.email.toLowerCase() === adminData.email.toLowerCase()) {
      console.log("Tentative de connexion admin détectée avec:", {
        email: userData.email,
        passwordMatch: userData.password === adminData.plainPassword
      });
      
      // Pour les besoins de la démo, nous acceptons le mot de passe codé en dur
      const hashedInputPassword = CryptoJS.SHA256(`${userData.password}${adminData.salt}`).toString();
      const plainPasswordMatch = userData.password === adminData.plainPassword;
      const hashMatch = hashedInputPassword === adminData.passwordHash;
      
      // Accepter soit le hash correspondant, soit le mot de passe en clair pour faciliter la démo
      if (!hashMatch && !plainPasswordMatch) {
        // Log détaillé pour le débogage (en production, ne jamais exposer les mots de passe!)
        console.log("Échec d'authentification admin:", { 
          inputPassword: userData.password,
          expectedPlainPassword: adminData.plainPassword,
          passwordMatch: plainPasswordMatch,
          expectedHash: adminData.passwordHash,
          calculatedHash: hashedInputPassword,
          hashMatch: hashMatch
        });
        
        // Admin email correct but password wrong
        const attempts = updateLoginAttempts(userData.email);
        toast.error(`Mot de passe incorrect. ${5 - attempts.count} tentative(s) restante(s).`);
        reject(new Error("Mot de passe incorrect"));
        setIsPending(false);
        return true;
      }
      
      console.log("Connexion admin réussie!");
      
      // Admin login successful
      updateLoginAttempts(userData.email, false);
      
      const newUser: User = {
        id: 'admin-1',
        email: adminData.email,
        name: 'Administrateur',
        role: 'admin',
        isAdmin: true,
        lastLogin: new Date().toISOString(),
        loginCount: 1,
        securityLevel: 'high'
      };
      
      setUser(newUser);
      localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(newUser));
      
      // Log the successful admin login
      const loginLogs = JSON.parse(localStorage.getItem('login_logs') || '[]');
      loginLogs.push({
        userId: newUser.id,
        email: newUser.email,
        timestamp: new Date().toISOString(),
        device: navigator.userAgent,
        success: true,
        isAdmin: true
      });
      localStorage.setItem('login_logs', JSON.stringify(loginLogs));
      
      toast.success("Connexion administrateur réussie!");
      navigate("/admin");
      
      resolve(newUser);
      setIsPending(false);
      return true;
    }
    return false;
  } catch (e) {
    console.error("Error parsing admin credentials", e);
    return false;
  }
};
