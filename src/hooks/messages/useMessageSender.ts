
import { useState } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { toast } from 'sonner';
import { handleAutoResponse } from './utils/autoResponseUtils';
import { updateAdminConversation } from './utils/adminConversationUtils';

export const useMessageSender = (
  userId: string | undefined,
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !userId) return;
    
    const timestamp = new Date();
    
    // Créer le nouveau message
    const updatedMessage: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      timestamp,
      read: true,
      sender: 'user',
    };
    
    // Mettre à jour la conversation localement
    const updatedSelectedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, updatedMessage],
      lastMessage: {
        content: newMessage,
        timestamp,
        read: true,
        sender: 'user' as const,  // Explicitly type as a literal "user" type
      },
    };
    
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedSelectedConversation : conv
    );
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedSelectedConversation);
    
    // Sauvegarder dans localStorage
    localStorage.setItem(`conversations_${userId}`, JSON.stringify(updatedConversations));
    
    // Si c'est une conversation avec l'admin, mettre à jour sa version aussi
    if (selectedConversation.with.id === 'admin') {
      const currentUser = JSON.parse(localStorage.getItem('users') || '[]')
        .find((u: any) => u.id === userId);
        
      updateAdminConversation(
        userId,
        updatedMessage,
        null, // Pas de réponse automatique
        currentUser
      );
    }
    
    // Réinitialiser le champ de message
    setNewMessage('');
    toast.success("Message envoyé");
  };

  return {
    newMessage,
    setNewMessage,
    handleSendMessage
  };
};
