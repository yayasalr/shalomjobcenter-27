
import { Conversation, Message } from '@/components/messages/types';
import { toast } from 'sonner';
import { updateAdminConversation } from './adminConversationUtils';

/**
 * Generates and handles automatic responses for system or admin conversations
 */
export const handleAutoResponse = (
  userId: string,
  selectedConversation: Conversation,
  updatedConversation: Conversation,
  updatedConversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
): void => {
  setTimeout(() => {
    const autoResponseSender = selectedConversation.with.id === 'admin' ? 'admin' : 'system';
    const autoResponse: Message = {
      id: `auto-${Date.now()}`,
      content: selectedConversation.with.id === 'admin' 
        ? "Merci pour votre message. Je reviendrai vers vous dès que possible."
        : "Merci de votre intérêt pour nos services. Notre équipe est là pour vous aider !",
      timestamp: new Date(),
      read: false,
      sender: autoResponseSender as "admin" | "system",
    };
    
    // Ajouter la réponse automatique à la conversation locale
    const convWithResponse = {
      ...updatedConversation,
      messages: [...updatedConversation.messages, autoResponse],
      lastMessage: {
        content: autoResponse.content,
        timestamp: autoResponse.timestamp,
        read: false,
        sender: autoResponseSender as "admin" | "system",
      },
    };
    
    // Mettre à jour l'état local
    const finalConversations = updatedConversations.map(conv => 
      conv.id === selectedConversation.id ? convWithResponse : conv
    );
    
    setConversations(finalConversations);
    setSelectedConversation(convWithResponse);
    
    // Mettre à jour dans localStorage
    localStorage.setItem(`conversations_${userId}`, JSON.stringify(finalConversations));
    
    // Si c'est l'admin, mettre à jour également le localStorage côté admin
    if (selectedConversation.with.id === 'admin') {
      try {
        // Récupération des données utilisateur
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = users.find((u: any) => u.id === userId);
        
        if (currentUser) {
          // Get the last user message to use with the auto-response
          const userMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
          
          // Mettre à jour la conversation admin dans le stockage admin
          updateAdminConversation(userId, userMessage, autoResponse, currentUser);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la conversation admin:", error);
      }
    }
    
    toast.success("Nouveau message reçu");
  }, Math.random() * 2000 + 1000); // Entre 1 et 3 secondes
};
