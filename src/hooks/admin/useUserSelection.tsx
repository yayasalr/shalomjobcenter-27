
import { useState } from 'react';
import { toast } from 'sonner';

export const useUserSelection = (
  conversations: any[],
  handleSelectConversation: (conversation: any) => void,
  refreshConversations: () => void
) => {
  const [showUsersList, setShowUsersList] = useState(false);

  const handleCreateNewConversation = () => {
    setShowUsersList(true);
  };

  const handleSelectUser = (userId: string, userName: string) => {
    console.log(`Selected user: ${userName} (${userId})`);
    setShowUsersList(false);
    
    // Récupérer les utilisateurs
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Trouver l'utilisateur sélectionné
    const selectedUser = users.find((u: any) => u.id === userId);
    
    if (!selectedUser) {
      toast.error("Utilisateur non trouvé");
      return;
    }
    
    // Créer une nouvelle conversation
    const existingConv = conversations.find(conv => conv.with.id === userId);
    
    if (existingConv) {
      // Si la conversation existe déjà, la sélectionner
      handleSelectConversation(existingConv);
      toast.info(`Conversation avec ${userName} reprise`);
    } else {
      // Sinon, créer une nouvelle conversation
      const newConversation = {
        id: `admin-${userId}-${Date.now()}`,
        with: {
          id: userId,
          name: userName,
          email: selectedUser.email || '',
          avatar: selectedUser.avatar || '/placeholder.svg',
          role: selectedUser.role || 'user',
        },
        lastMessage: {
          content: "Nouvelle conversation",
          timestamp: new Date(),
          read: true,
          sender: 'admin' as const,
        },
        messages: [
          {
            id: `welcome-${Date.now()}`,
            content: `Bienvenue ${userName}! Comment puis-je vous aider ?`,
            timestamp: new Date(),
            read: true,
            sender: 'admin',
          }
        ],
      };
      
      // Mettre à jour le localStorage
      const key = `conversations_${userId}`;
      const userConversation = {
        id: `user-admin-${Date.now()}`,
        with: {
          id: 'admin',
          name: 'Administrateur',
          avatar: '/placeholder.svg',
          role: 'admin',
        },
        lastMessage: {
          content: `Bienvenue ${userName}! Comment puis-je vous aider ?`,
          timestamp: new Date(),
          read: false,
          sender: 'admin',
        },
        messages: [
          {
            id: `welcome-${Date.now()}`,
            content: `Bienvenue ${userName}! Comment puis-je vous aider ?`,
            timestamp: new Date(),
            read: false,
            sender: 'admin',
          }
        ],
      };
      
      const existingConvs = localStorage.getItem(key);
      const userConversations = existingConvs ? JSON.parse(existingConvs) : [];
      userConversations.push(userConversation);
      localStorage.setItem(key, JSON.stringify(userConversations));
      
      // Actualiser les conversations et sélectionner la nouvelle
      refreshConversations();
      
      // Notifier l'utilisateur
      toast.success(`Nouvelle conversation avec ${userName} créée`);
    }
  };

  return {
    showUsersList,
    setShowUsersList,
    handleCreateNewConversation,
    handleSelectUser
  };
};

export default useUserSelection;
