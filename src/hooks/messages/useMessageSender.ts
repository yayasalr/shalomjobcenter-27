
import { useState, useCallback } from 'react';
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
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSendMessage = useCallback(() => {
    if ((!newMessage.trim() && !selectedImage) || !selectedConversation || !userId || isSending) return;
    
    // Prévenir l'envoi de messages multiples
    setIsSending(true);
    
    const timestamp = new Date();
    
    // Créer le nouveau message
    const updatedMessage: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      timestamp,
      read: true,
      sender: 'user',
    };

    // Add image to message if selected
    if (selectedImage) {
      updatedMessage.image = selectedImage;
    }
    
    // Mettre à jour la conversation localement
    const updatedSelectedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, updatedMessage],
      lastMessage: {
        content: newMessage || (selectedImage ? "📷 Image" : ""),
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
    
    // Vider le champ de message et l'image immédiatement
    setNewMessage('');
    setSelectedImage(null);
    
    // Sauvegarder dans localStorage
    try {
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
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      // Autoriser l'envoi de nouveaux messages
      setIsSending(false);
    }
  }, [newMessage, selectedImage, selectedConversation, userId, conversations, setConversations, setSelectedConversation, isSending]);

  // Handle image selection
  const handleImageSelect = (file: File) => {
    // Create a URL for the image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  // Clear selected image
  const handleClearImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
  };

  return {
    newMessage,
    setNewMessage,
    handleSendMessage,
    isSending,
    selectedImage,
    handleImageSelect,
    handleClearImage
  };
};
