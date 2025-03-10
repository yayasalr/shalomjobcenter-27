
import { ADMIN_USER, Conversation, Message } from "@/components/messages/types";

/**
 * Creates a welcome message and conversation for a new user
 */
export const createWelcomeMessage = (userId: string): void => {
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

/**
 * Updates the admin side conversation with the welcome message
 */
const updateAdminSideConversation = (userId: string, welcomeMessage: Message): void => {
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
