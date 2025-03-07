
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, LoginCredentials } from "../types";
import { LocalStorageKeys } from "../authUtils";
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
            // Simulation of failed authentication (if password is incorrect)
            const isValidLogin = userData.email.includes('@') && userData.password && userData.password.length >= 6;
            
            if (!isValidLogin) {
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
                toast.error(`Identifiants incorrects. ${5 - attempts.count} tentative(s) restante(s).`);
                reject(new Error("Identifiants incorrects"));
              }
              setIsPending(false);
              return;
            }
            
            // On success, reset the attempt counter
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
            
            // Increment the login counter
            const existingUser = localStorage.getItem(LocalStorageKeys.USER);
            if (existingUser) {
              try {
                const parsed = JSON.parse(existingUser);
                if (parsed.email === userData.email) {
                  newUser.loginCount = (parsed.loginCount || 0) + 1;
                }
              } catch (e) {
                console.error("Error retrieving user data", e);
              }
            }
            
            setUser(newUser);
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
