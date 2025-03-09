
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, RegisterData } from "../types";
import { LocalStorageKeys } from "../authUtils";
import { ADMIN_USER, WELCOME_BOT, Conversation, Message } from "@/components/messages/types";

export const useRegisterMutation = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const registerUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(userData));
    
    // Créer le message de bienvenue initial
    createWelcomeMessage(userData.id);
    
    toast.success("Inscription réussie!");
    navigate("/");
  };
  
  // Fonction pour créer le message de bienvenue
  const createWelcomeMessage = (userId: string) => {
    try {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: "Bienvenue sur SHALOM JOB CENTER ! Nous sommes ravis de vous accueillir. N'hésitez pas à parcourir les offres d'emploi et les logements disponibles. Si vous avez des questions, contactez notre équipe d'assistance.",
        timestamp: new Date(),
        read: false,
        sender: "admin"
      };
      
      // Créer une conversation avec l'administrateur
      const adminConversation: Conversation = {
        id: `admin-${Date.now()}`,
        with: ADMIN_USER,
        messages: [welcomeMessage],
        lastMessage: {
          content: welcomeMessage.content,
          timestamp: welcomeMessage.timestamp,
          read: false,
          sender: "admin"
        }
      };
      
      // Enregistrer la conversation dans le localStorage
      const userConversations = [];
      userConversations.push(adminConversation);
      localStorage.setItem(`conversations_${userId}`, JSON.stringify(userConversations));
      
      // Ajouter cette conversation au côté administrateur aussi
      updateAdminSideConversation(userId, welcomeMessage);
      
      console.log("Message de bienvenue créé avec succès pour l'utilisateur:", userId);
    } catch (error) {
      console.error("Erreur lors de la création du message de bienvenue:", error);
    }
  };
  
  // Fonction pour mettre à jour la conversation côté administrateur
  const updateAdminSideConversation = (userId: string, welcomeMessage: Message) => {
    try {
      // Récupérer les informations de l'utilisateur
      const existingUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
      const userData = existingUsers.find((u: any) => u.id === userId);
      
      if (!userData) return;
      
      // Créer ou récupérer les conversations admin
      const adminConversations = JSON.parse(localStorage.getItem('admin_conversations') || '[]');
      
      // Créer une nouvelle conversation pour l'admin
      const newAdminConversation: Conversation = {
        id: `admin-${userId}`,
        with: {
          id: userId,
          name: userData.name || userData.email.split('@')[0],
          email: userData.email,
          avatar: userData.avatar || '/placeholder.svg',
          role: userData.role || 'user',
        },
        messages: [welcomeMessage],
        lastMessage: {
          content: welcomeMessage.content,
          timestamp: welcomeMessage.timestamp,
          read: true, // Admin a lu son propre message
          sender: "admin"
        }
      };
      
      // Ajouter la nouvelle conversation
      adminConversations.push(newAdminConversation);
      
      // Enregistrer dans le localStorage
      localStorage.setItem('admin_conversations', JSON.stringify(adminConversations));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la conversation admin:", error);
    }
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
