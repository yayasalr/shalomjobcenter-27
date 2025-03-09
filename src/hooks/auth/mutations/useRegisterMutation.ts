
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, RegisterData } from "../types";
import { LocalStorageKeys } from "../authUtils";

export const useRegisterMutation = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const registerUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(userData));
    toast.success("Inscription réussie!");
    navigate("/");
  };

  const register = {
    mutateAsync: async (data: RegisterData): Promise<User | void> => {
      setIsPending(true);
      return new Promise((resolve, reject) => {
        try {
          // Check if the email is already in use
          const existingUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
          const emailExists = existingUsers.some((u: any) => u.email === data.email);
          
          if (emailExists) {
            toast.error("Cet email est déjà utilisé");
            reject(new Error("Email déjà utilisé"));
            setIsPending(false);
            return;
          }
          
          setTimeout(() => {
            const newUser: User = {
              id: `user-${Date.now()}`,
              email: data.email,
              name: data.name || data.email.split('@')[0],
              role: 'user',
              isAdmin: false, // Add the required isAdmin property
              created: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              loginCount: 1,
              securityLevel: 'standard'
            };
            
            // Add the user to the list of users
            existingUsers.push(newUser);
            localStorage.setItem('all_users', JSON.stringify(existingUsers));
            
            registerUser(newUser);
            
            // Log the account creation
            const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
            securityLogs.push({
              type: 'account_created',
              userId: newUser.id,
              email: newUser.email,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent
            });
            localStorage.setItem('security_logs', JSON.stringify(securityLogs));
            
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

  return { register, registerUser };
};
