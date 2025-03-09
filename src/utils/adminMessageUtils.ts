
import { Conversation, Message } from '@/components/messages/types';

// Charger les conversations admin depuis localStorage
export const loadAdminConversations = (): Conversation[] => {
  try {
    const storedConversations = localStorage.getItem('admin_conversations');
    if (!storedConversations) return [];
    
    return JSON.parse(storedConversations, (k, v) => {
      if (k === 'timestamp' && typeof v === 'string') {
        return new Date(v);
      }
      return v;
    });
  } catch (error) {
    console.error("Erreur lors du chargement des conversations admin:", error);
    return [];
  }
};

// Sauvegarder les conversations admin dans localStorage
export const saveAdminConversations = (conversations: Conversation[]): void => {
  try {
    localStorage.setItem('admin_conversations', JSON.stringify(conversations));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des conversations admin:", error);
  }
};

// Mettre à jour la conversation utilisateur dans localStorage
export const updateUserConversation = (userId: string, updatedConversation: Conversation): void => {
  try {
    // Charger les conversations de l'utilisateur
    const userConversationsKey = `conversations_${userId}`;
    const storedConversations = localStorage.getItem(userConversationsKey);
    
    if (storedConversations) {
      const userConversations: Conversation[] = JSON.parse(storedConversations);
      
      // Trouver et mettre à jour la conversation avec l'admin
      const adminConvIndex = userConversations.findIndex(conv => conv.with.id === 'admin');
      
      if (adminConvIndex >= 0) {
        // Mettre à jour la conversation existante
        userConversations[adminConvIndex] = {
          ...updatedConversation,
          id: userConversations[adminConvIndex].id, // Garder l'ID original
          with: {
            id: 'admin',
            name: 'Administrateur',
            avatar: '/placeholder.svg',
            role: 'admin',
          },
        };
        
        // Sauvegarder les conversations mises à jour
        localStorage.setItem(userConversationsKey, JSON.stringify(userConversations));
      }
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la conversation utilisateur:", error);
  }
};

// Marquer une conversation comme lue
export const markConversationAsRead = (conversation: Conversation): Conversation => {
  // Marquer tous les messages comme lus
  const updatedMessages = conversation.messages.map(msg => {
    if (msg.sender !== 'admin' && !msg.read) {
      return { ...msg, read: true };
    }
    return msg;
  });
  
  // Mettre à jour la conversation
  return {
    ...conversation,
    messages: updatedMessages,
    lastMessage: {
      ...conversation.lastMessage,
      read: true
    }
  };
};

// Obtenir le nombre de messages non lus dans une conversation
export const getUnreadCount = (conversation: Conversation): number => {
  return conversation.messages.filter(msg => msg.sender !== 'admin' && !msg.read).length;
};

// Obtenir le nombre total de messages non lus dans toutes les conversations
export const getTotalUnreadCount = (conversations: Conversation[]): number => {
  return conversations.reduce((total, conv) => total + getUnreadCount(conv), 0);
};
