
import { Conversation, Message } from '@/components/messages/types';

/**
 * Loads admin conversations from localStorage
 */
export const loadAdminConversations = (): Conversation[] => {
  try {
    return JSON.parse(localStorage.getItem('admin_conversations') || '[]', (k, v) => {
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

/**
 * Updates the admin side of a conversation when a user sends a message
 */
export const updateAdminConversation = (
  userId: string, 
  userMessage: Message,
  adminResponse: Message,
  userData: any
): void => {
  // Charger toutes les conversations admin
  const adminConversations = loadAdminConversations();
  
  // Rechercher la conversation avec cet utilisateur
  const adminConvIndex = adminConversations.findIndex(conv => 
    conv.with.id === userId
  );
  
  if (adminConvIndex >= 0) {
    // Mettre à jour la conversation existante
    const updatedAdminConv = {
      ...adminConversations[adminConvIndex],
      messages: [
        ...adminConversations[adminConvIndex].messages,
        // Ajouter le message utilisateur et la réponse admin
        {
          ...userMessage,
          read: false,  // Non lu par l'admin
          sender: 'user' as const,
        },
        {
          ...adminResponse,
          read: true,   // Lu par l'admin qui l'a envoyé
          sender: 'admin' as const,
        }
      ],
      lastMessage: {
        content: adminResponse.content,
        timestamp: adminResponse.timestamp,
        read: true,
        sender: 'admin' as const,
      },
    };
    
    adminConversations[adminConvIndex] = updatedAdminConv;
  } else {
    // Créer une nouvelle conversation admin si elle n'existe pas encore
    adminConversations.push({
      id: `admin-${userId}`,
      with: {
        id: userId,
        name: userData.name || 'Utilisateur inconnu',
        email: userData.email || '',
        avatar: userData.avatar || '/placeholder.svg',
        role: userData.role || 'user',
      },
      messages: [
        {
          ...userMessage,
          read: false,
          sender: 'user' as const,
        },
        {
          ...adminResponse,
          read: true,
          sender: 'admin' as const,
        }
      ],
      lastMessage: {
        content: adminResponse.content,
        timestamp: adminResponse.timestamp,
        read: true,
        sender: 'admin' as const,
      },
    });
  }
  
  // Sauvegarder les conversations admin mises à jour dans localStorage
  localStorage.setItem('admin_conversations', JSON.stringify(adminConversations));
};
