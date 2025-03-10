
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LoginCredentials } from "../types";
import { useSecurityFeatures } from "../useSecurityFeatures";
import { validateLoginCredentials } from "./login/loginValidator";
import { handleAdminLogin } from "./login/adminLoginHandler";
import { handleUserLogin } from "./login/userLoginHandler";

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
          // Check account lock status
          const lockStatus = checkAccountLocked(userData.email);
          
          // Validate credentials
          if (!validateLoginCredentials(userData.email, lockStatus)) {
            reject(new Error("Validation failed"));
            setIsPending(false);
            return;
          }

          // Simulate authentication delay
          setTimeout(() => {
            // Try admin login first
            const adminCreds = localStorage.getItem('admin_credentials');
            const isAdmin = handleAdminLogin(
              userData, 
              adminCreds, 
              updateLoginAttempts, 
              setUser, 
              setIsPending, 
              navigate, 
              resolve, 
              reject
            );
            
            // If not admin, try regular user login
            if (!isAdmin) {
              handleUserLogin(
                userData, 
                updateLoginAttempts, 
                setUser, 
                setIsPending, 
                navigate, 
                resolve, 
                reject
              );
            }
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
