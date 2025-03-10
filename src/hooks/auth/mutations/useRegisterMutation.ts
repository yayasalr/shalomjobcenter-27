
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, RegisterData } from "../types";
import { validateRegistrationData } from "./register/registerValidator";
import { createUser, completeRegistration } from "./register/userProcessor";
import { createWelcomeMessage } from "./register/welcomeMessageCreator";

export const useRegisterMutation = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const registerUser = (userData: User) => {
    completeRegistration(userData, setUser);
    
    // Créer le message de bienvenue initial
    createWelcomeMessage(userData.id);
    
    navigate("/");
  };

  const register = {
    mutateAsync: async (data: RegisterData): Promise<User | void> => {
      setIsPending(true);
      return new Promise((resolve, reject) => {
        try {
          // Enhanced validation
          if (!validateRegistrationData(data)) {
            reject(new Error("Validation failed"));
            setIsPending(false);
            return;
          }
          
          setTimeout(() => {
            try {
              // Create the user
              const newUser = createUser(data);
              
              registerUser(newUser);
              
              resolve(newUser);
            } catch (error) {
              console.error("Error creating user:", error);
              reject(error);
            } finally {
              setIsPending(false);
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

  return { register, registerUser };
};
