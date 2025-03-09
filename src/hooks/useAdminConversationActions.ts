
import { useState } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { updateUserConversation, markConversationAsRead } from '@/utils/adminMessageUtils';
import { toast } from 'sonner';

export const useAdminConversationActions = (
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>,
  newMessage: string,
  setNewMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const [sendingMessage, setSendingMessage] = useState(false);

  // Envoyer un message instantané en tant qu'admin
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSendingMessage(true);
    
    // Créer le nouveau message immédiatement
    const messageToSend: Message = {
      id: `admin-${Date.now()}`,
      content: newMessage,
      timestamp: new Date(),
      read: true,
      sender: 'admin',
    };

    // Mettre à jour immédiatement la conversation sélectionnée
    const updatedSelectedConversation: Conversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, messageToSend],
      lastMessage: {
        content: newMessage,
        timestamp: new Date(),
        read: true,
        sender: 'admin' as const,
      },
    };

    // Mettre à jour toutes les conversations
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id
        ? updatedSelectedConversation
        : conv
    );

    // Mettre à jour l'état
    setConversations(updatedConversations);
    setSelectedConversation(updatedSelectedConversation);
    setNewMessage('');
    
    // Mettre à jour la conversation de l'utilisateur dans localStorage
    const userId = selectedConversation.with.id;
    updateUserConversation(userId, updatedSelectedConversation);
    
    // Notifier les autres onglets ou fenêtres via BroadcastChannel
    try {
      const channel = new BroadcastChannel('admin-messaging-channel');
      channel.postMessage({
        type: 'refresh-conversations',
        timestamp: Date.now()
      });
      
      // Nettoyer le canal après utilisation
      setTimeout(() => channel.close(), 100);
    } catch (error) {
      console.error("Erreur lors de la diffusion du message:", error);
    }
    
    // Déclencher un événement pour notifier d'autres composants
    window.dispatchEvent(new CustomEvent('admin-messages-updated', { 
      detail: { userId, action: 'message-sent' } 
    }));
    
    // Afficher un toast de succès
    toast.success("Message envoyé avec succès");
    setSendingMessage(false);
  };

  // Sélectionner une conversation et marquer ses messages comme lus
  const handleSelectConversation = (conversation: Conversation) => {
    try {
      // Marquer les messages comme lus
      const updatedConversation = markConversationAsRead(conversation);
      
      // Mettre à jour toutes les conversations
      const updatedConversations = conversations.map(conv => 
        conv.id === conversation.id
          ? updatedConversation
          : conv
      );
      
      // Mettre à jour l'état
      setConversations(updatedConversations);
      setSelectedConversation(updatedConversation);
      
      // Mettre à jour la conversation de l'utilisateur dans localStorage
      const userId = conversation.with.id;
      updateUserConversation(userId, updatedConversation);
      
      // Notifier les autres onglets ou fenêtres
      try {
        const channel = new BroadcastChannel('admin-messaging-channel');
        channel.postMessage({
          type: 'refresh-conversations',
          timestamp: Date.now()
        });
        setTimeout(() => channel.close(), 100);
      } catch (error) {
        console.error("Erreur lors de la diffusion du message:", error);
      }
      
      // Déclencher un événement
      window.dispatchEvent(new CustomEvent('admin-messages-updated', { 
        detail: { userId, action: 'conversation-read' } 
      }));
    } catch (error) {
      console.error("Erreur lors de la sélection de conversation:", error);
      setSelectedConversation(conversation);
    }
  };

  return {
    handleSendMessage,
    handleSelectConversation,
    sendingMessage
  };
};
