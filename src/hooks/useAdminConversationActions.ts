
import { useState } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { updateUserConversation } from '@/utils/adminMessageUtils';
import { toast } from 'sonner';

export const useAdminConversationActions = (
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>,
  newMessage: string,
  setNewMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const updatedMessage: Message = {
      id: `m${Date.now()}`,
      content: newMessage,
      sender: 'admin',
      timestamp: new Date(),
      read: true,
    };
    
    // Mettre à jour la conversation sélectionnée
    const updatedSelectedConversation: Conversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, updatedMessage],
      lastMessage: {
        content: newMessage,
        timestamp: new Date(),
        read: true,
        sender: 'admin',
      },
    };
    
    // Mettre à jour l'état des conversations
    const updatedConversations: Conversation[] = conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedSelectedConversation : conv
    );
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedSelectedConversation);
    setNewMessage('');
    
    // Mettre à jour la conversation de l'utilisateur dans le localStorage
    updateUserConversation(selectedConversation.with.id, updatedSelectedConversation);
    
    toast.success("Message envoyé avec succès");
  };

  // Marquer les messages comme lus lorsqu'une conversation est sélectionnée
  const handleSelectConversation = (conversation: Conversation) => {
    // Marquer tous les messages utilisateur comme lus
    const updatedMessages = conversation.messages.map(msg => ({
      ...msg,
      read: true
    }));
    
    const updatedConversation: Conversation = {
      ...conversation,
      messages: updatedMessages,
      lastMessage: {
        ...conversation.lastMessage,
        read: true
      }
    };
    
    // Mettre à jour l'état des conversations
    const updatedConversations: Conversation[] = conversations.map(conv => 
      conv.id === conversation.id ? updatedConversation : conv
    );
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedConversation);
    
    // Mettre à jour dans le localStorage
    updateUserConversation(conversation.with.id, updatedConversation);
  };

  return {
    handleSendMessage,
    handleSelectConversation
  };
};
