
import { useState } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { toast } from 'sonner';
import { handleAutoResponse } from './utils/autoResponseUtils';

export const useMessageSender = (
  userId: string | undefined,
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const [newMessage, setNewMessage] = useState('');

  // Send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !userId) return;
    
    // Créer le nouveau message
    const updatedMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      timestamp: new Date(),
      read: true,
      sender: 'user' as const,
    };
    
    // Mettre à jour la conversation sélectionnée et la liste des conversations
    const updatedSelectedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, updatedMessage],
      lastMessage: {
        content: newMessage,
        timestamp: new Date(),
        read: true,
        sender: 'user' as const,
      },
    };
    
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedSelectedConversation : conv
    );
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedSelectedConversation);
    
    // Sauvegarder dans localStorage pour persister les changements
    localStorage.setItem(`conversations_${userId}`, JSON.stringify(updatedConversations));
    
    // Réinitialiser le champ de message
    setNewMessage('');
    
    // Pour les conversations avec admin ou bot d'accueil, mettre à jour aussi leur côté
    if (selectedConversation.with.id === 'admin' || selectedConversation.with.id === 'welcome-bot') {
      handleAutoResponse(
        userId,
        selectedConversation,
        updatedSelectedConversation,
        updatedConversations,
        setConversations,
        setSelectedConversation
      );
    }
  };

  return {
    newMessage,
    setNewMessage,
    handleSendMessage
  };
};
