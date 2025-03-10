
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CryptoJS from "crypto-js";
import { User, LoginCredentials } from "../types";
import { LocalStorageKeys, validatePasswordStrength, isValidEmail } from "../authUtils";
import { useSecurityFeatures } from "../useSecurityFeatures";

export const useLoginMutation = (
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const { updateLoginAttempts, checkAccountLocked } = useSecurityFeatures(user);

  const login = {
    mutateAsync: async (userData: LoginCredentials): Promise<User | void> => {
      setIsPending(true);
      return new Promise((resolve, reject) => {
        try {
          // Validate email format first
          if (!isValidEmail(userData.email)) {
            toast.error(`Format d'email invalide`);
            reject(new Error("Format d'email invalide"));
            setIsPending(false);
            return;
          }
          
          // Check if the account is locked
          const lockStatus = checkAccountLocked(userData.email);
          if (lockStatus.locked) {
            toast.error(`Compte verrouillé. Réessayez dans ${lockStatus.remainingMinutes} minutes ou contactez l'administrateur.`);
            reject(new Error("Compte verrouillé"));
            setIsPending(false);
            return;
          }

          // Simulate authentication verification
          setTimeout(() => {
            // Check for admin credentials first
            const adminCreds = localStorage.getItem('admin_credentials');
            let isAdmin = false;
            
            if (adminCreds) {
              try {
                const adminData = JSON.parse(adminCreds);
                // Check if this is the admin trying to log in
                if (userData.email.toLowerCase() === adminData.email.toLowerCase()) {
                  isAdmin = true;
                  
                  // For admin, check password match specifically
                  const hashedInputPassword = CryptoJS.SHA256(`${userData.password}${adminData.salt}`).toString();
                  
                  if (hashedInputPassword !== adminData.passwordHash) {
                    // Admin email correct but password wrong
                    const attempts = updateLoginAttempts(userData.email);
                    toast.error(`Mot de passe incorrect. ${5 - attempts.count} tentative(s) restante(s).`);
                    reject(new Error("Mot de passe incorrect"));
                    setIsPending(false);
                    return;
                  }
                  
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
                  return;
                }
              } catch (e) {
                console.error("Error parsing admin credentials", e);
              }
            }
            
            // For non-admin users
            // If email is not admin's, check if it exists in all_users
            const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
            const foundUser = allUsers.find((u: any) => 
              u.email.toLowerCase() === userData.email.toLowerCase()
            );
            
            if (!foundUser) {
              // User not found
              const attempts = updateLoginAttempts(userData.email);
              
              if (attempts.count >= 5) {
                toast.error(`Trop de tentatives échouées. Compte verrouillé pour 1 heure.`);
                
                // Record this attempt in the security logs
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
                toast.error(`Email non trouvé. ${5 - attempts.count} tentative(s) restante(s).`);
                reject(new Error("Email non trouvé"));
              }
              setIsPending(false);
              return;
            }
            
            // Basic password validation for regular users (in a real app, you'd verify hashed passwords)
            const isValidPassword = userData.password && userData.password.length >= 6;
            
            if (!isValidPassword) {
              const attempts = updateLoginAttempts(userData.email);
              
              if (attempts.count >= 5) {
                toast.error(`Trop de tentatives échouées. Compte verrouillé pour 1 heure.`);
                
                // Record this attempt in the security logs
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
                toast.error(`Mot de passe incorrect. ${5 - attempts.count} tentative(s) restante(s).`);
                reject(new Error("Mot de passe incorrect"));
              }
              setIsPending(false);
              return;
            }
            
            // On success, reset the attempt counter
            updateLoginAttempts(userData.email, false);
            
            const newUser: User = {
              ...foundUser,
              lastLogin: new Date().toISOString(),
              loginCount: (foundUser.loginCount || 0) + 1,
            };
            
            setUser(newUser);
            
            // Update the user in all_users
            const updatedUsers = allUsers.map((u: any) => {
              if (u.email.toLowerCase() === userData.email.toLowerCase()) {
                return newUser;
              }
              return u;
            });
            localStorage.setItem('all_users', JSON.stringify(updatedUsers));
            
            // Also update the current user
            localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(newUser));
            
            // Log the successful login
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
            
            resolve(newUser);
            setIsPending(false);
          }, 500);
        } catch (error) {
          setIsPending(false);
          reject(error);
        }
      });
    },
    isPending
  };

  return { login };
};
