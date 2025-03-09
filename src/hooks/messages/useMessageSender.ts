
import { useState } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { toast } from 'sonner';
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
        sender: 'user' as const,
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
      // Récupérer les informations de l'utilisateur actuel
      const currentUser = JSON.parse(localStorage.getItem('users') || '[]')
        .find((u: any) => u.id === userId);
      
      // Mettre à jour immédiatement la conversation admin
      updateAdminConversation(
        userId,
        updatedMessage,
        null, // Pas de réponse automatique
        currentUser || { name: 'Utilisateur inconnu', email: '', avatar: '/placeholder.svg' }
      );
      
      // Ajouter une notification pour indiquer que le message a été envoyé à l'admin
      toast.success("Message envoyé à l'administrateur", {
        description: "L'administrateur recevra votre message instantanément."
      });
    } else {
      // Pour les autres utilisateurs, simuler une réponse après un délai
      setTimeout(() => {
        const autoReply: Message = {
          id: `reply-${Date.now()}`,
          content: `Ceci est une réponse automatique de ${selectedConversation.with.name}. Votre message a bien été reçu.`,
          timestamp: new Date(),
          read: false,
          sender: 'other',
        };
        
        // Mettre à jour la conversation avec la réponse
        const conversationWithReply = {
          ...updatedSelectedConversation,
          messages: [...updatedSelectedConversation.messages, autoReply],
          lastMessage: {
            content: autoReply.content,
            timestamp: autoReply.timestamp,
            read: false,
            sender: 'other' as const,
          },
        };
        
        const newUpdatedConversations = updatedConversations.map(conv => 
          conv.id === selectedConversation.id ? conversationWithReply : conv
        );
        
        setConversations(newUpdatedConversations);
        
        // Si la conversation est toujours sélectionnée, mettre à jour
        if (updatedSelectedConversation.id === selectedConversation.id) {
          setSelectedConversation(conversationWithReply);
        }
        
        // Sauvegarder dans localStorage
        localStorage.setItem(`conversations_${userId}`, JSON.stringify(newUpdatedConversations));
        
        // Notification de nouvelle réponse
        toast.info(`Nouvelle réponse de ${selectedConversation.with.name}`);
      }, 3000); // Réponse après 3 secondes
      
      toast.success("Message envoyé");
    }
    
    // Réinitialiser le champ de message
    setNewMessage('');
  };

  return {
    newMessage,
    setNewMessage,
    handleSendMessage
  };
};
