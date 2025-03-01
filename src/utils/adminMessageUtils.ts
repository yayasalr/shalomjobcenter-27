
import { Conversation, Message } from '@/components/messages/types';

/**
 * Transforms a user conversation for admin view
 */
export const transformToAdminConversation = (
  userId: string,
  userData: any,
  adminConv: any
): Conversation => {
  return {
    id: `admin-${userId}`,
    with: {
      id: userId,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || '/placeholder.svg',
      role: userData.role,
    },
    lastMessage: {
      ...adminConv.lastMessage,
      sender: adminConv.lastMessage.sender === 'user' ? 'user' : 'admin',
    },
    messages: adminConv.messages.map((msg: any) => ({
      ...msg,
      sender: msg.sender === 'user' ? 'user' : 'admin',
    })),
  };
};

/**
 * Load all user conversations from localStorage
 */
export const loadAdminConversations = (): Conversation[] => {
  const allUserConversations: Conversation[] = [];
  
  // Parcourir le localStorage pour trouver toutes les conversations des utilisateurs
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('conversations_')) {
      try {
        const userId = key.replace('conversations_', '');
        const userConversations = JSON.parse(localStorage.getItem(key) || '[]', (k, v) => {
          if (k === 'timestamp' && typeof v === 'string') {
            return new Date(v);
          }
          return v;
        });
        
        // Filtrer pour trouver les conversations avec l'admin
        const adminConvs = userConversations.filter((conv: any) => 
          conv.with.id === 'admin'
        );
        
        if (adminConvs.length > 0) {
          // Trouver les informations de l'utilisateur
          const userData = JSON.parse(localStorage.getItem('users') || '[]').find(
            (u: any) => u.id === userId
          );
          
          if (userData) {
            // Transformer la conversation pour le point de vue de l'admin
            const transformedConv = transformToAdminConversation(userId, userData, adminConvs[0]);
            allUserConversations.push(transformedConv);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la lecture des conversations:", error);
      }
    }
  }
  
  // Trier par date du dernier message (le plus récent en premier)
  allUserConversations.sort((a, b) => 
    b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
  );
  
  return allUserConversations;
};

/**
 * Update a user's conversation in localStorage
 */
export const updateUserConversation = (userId: string, updatedConversation: Conversation) => {
  try {
    const key = `conversations_${userId}`;
    const userConversations = JSON.parse(localStorage.getItem(key) || '[]', (k, v) => {
      if (k === 'timestamp' && typeof v === 'string') {
        return new Date(v);
      }
      return v;
    });
    
    // Trouver et mettre à jour la conversation avec l'admin
    const updatedUserConversations = userConversations.map((conv: any) => {
      if (conv.with.id === 'admin') {
        // Créer une version transformée pour l'utilisateur
        return {
          ...conv,
          lastMessage: {
            content: updatedConversation.lastMessage.content,
            timestamp: updatedConversation.lastMessage.timestamp,
            read: false, // Toujours marquer comme non lu pour l'utilisateur
            sender: updatedConversation.lastMessage.sender === 'admin' ? 'admin' : 'user',
          },
          messages: updatedConversation.messages.map(msg => ({
            ...msg,
            sender: msg.sender === 'admin' ? 'admin' : 'user',
            read: msg.sender === 'user', // Les messages de l'utilisateur sont lus, ceux de l'admin non
          })),
        };
      }
      return conv;
    });
    
    localStorage.setItem(key, JSON.stringify(updatedUserConversations));
  } catch (error) {
    console.error("Erreur lors de la mise à jour des conversations:", error);
  }
};

/**
 * Get unread message count for a conversation
 */
export const getUnreadCount = (conversation: Conversation): number => {
  return conversation.messages.filter(msg => !msg.read && msg.sender === 'user').length;
};

/**
 * Get total unread message count across all conversations
 */
export const getTotalUnreadCount = (conversations: Conversation[]): number => {
  return conversations.reduce((count, conv) => {
    return count + getUnreadCount(conv);
  }, 0);
};
