
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

  // Send a message as admin with reduced delay for better responsiveness
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSendingMessage(true);
    
    // Show a loading notification to indicate message is being sent
    const sendingToast = toast.loading("Envoi du message en cours...");
    
    // Add a smaller delay to simulate network latency (0.5-1.5 seconds)
    setTimeout(() => {
      try {
        // Create the new message
        const messageToSend: Message = {
          id: `admin-${Date.now()}`,
          content: newMessage,
          timestamp: new Date(),
          read: true,
          sender: 'admin',
        };

        // Update the selected conversation
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

        // Update all conversations
        const updatedConversations = conversations.map(conv => 
          conv.id === selectedConversation.id
            ? updatedSelectedConversation
            : conv
        );

        // Update state
        setConversations(updatedConversations);
        setSelectedConversation(updatedSelectedConversation);
        setNewMessage('');

        // Update user's conversation in localStorage
        const userId = selectedConversation.with.id;
        updateUserConversation(userId, updatedSelectedConversation);

        // Déclencher un événement custom pour notifier d'autres fenêtres ou onglets
        try {
          const event = new CustomEvent('admin-messages-updated', { detail: { userId } });
          window.dispatchEvent(event);
        } catch (error) {
          console.error("Erreur lors de la diffusion de l'événement:", error);
        }

        toast.dismiss(sendingToast);
        toast.success("Message envoyé avec succès");
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
        toast.dismiss(sendingToast);
        toast.error("Erreur lors de l'envoi du message");
      } finally {
        setSendingMessage(false);
      }
    }, Math.random() * 1000 + 500); // 0.5-1.5 second delay (plus rapide qu'avant)
  };

  // Select a conversation and mark its messages as read
  const handleSelectConversation = (conversation: Conversation) => {
    try {
      // Mark messages as read
      const updatedConversation = markConversationAsRead(conversation);
      
      // Update all conversations
      const updatedConversations = conversations.map(conv => 
        conv.id === conversation.id
          ? updatedConversation
          : conv
      );
      
      // Update state
      setConversations(updatedConversations);
      setSelectedConversation(updatedConversation);
      
      // Also update the user's conversation in localStorage to mark these as read
      const userId = conversation.with.id;
      updateUserConversation(userId, updatedConversation);
      
      // Déclencher un événement pour notifier d'autres fenêtres ou onglets
      try {
        const event = new CustomEvent('admin-messages-updated', { detail: { userId } });
        window.dispatchEvent(event);
      } catch (error) {
        console.error("Erreur lors de la diffusion de l'événement:", error);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de conversation:", error);
      // Fallback to just selecting without marking as read
      setSelectedConversation(conversation);
    }
  };

  return {
    handleSendMessage,
    handleSelectConversation,
    sendingMessage
  };
};
