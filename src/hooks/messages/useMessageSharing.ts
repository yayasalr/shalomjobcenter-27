
import { useState, useCallback } from 'react';
import { Message, Conversation } from '@/components/messages/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useMessageSharing = (
  conversations: Conversation[],
  updateConversationWithMessage: (conversationId: string, message: Message) => void
) => {
  const { user } = useAuth();
  const [messageToShare, setMessageToShare] = useState<Message | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
  
  const openShareDialog = useCallback((message: Message) => {
    setMessageToShare(message);
    setIsShareDialogOpen(true);
    setSelectedConversations([]);
  }, []);
  
  const closeShareDialog = useCallback(() => {
    setIsShareDialogOpen(false);
    setMessageToShare(null);
    setSelectedConversations([]);
  }, []);
  
  const toggleConversationSelection = useCallback((conversationId: string) => {
    setSelectedConversations(prev => {
      if (prev.includes(conversationId)) {
        return prev.filter(id => id !== conversationId);
      } else {
        return [...prev, conversationId];
      }
    });
  }, []);
  
  const shareMessage = useCallback(() => {
    if (!messageToShare || selectedConversations.length === 0 || !user) {
      return;
    }
    
    // Créer un nouveau message basé sur celui à partager
    const now = new Date();
    
    selectedConversations.forEach(conversationId => {
      const forwardedMessage: Message = {
        id: `fwd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: `Message transféré: ${messageToShare.content}`,
        timestamp: now,
        sender: 'user',
        read: true
      };
      
      // Mettre à jour la conversation avec le message transféré
      updateConversationWithMessage(conversationId, forwardedMessage);
    });
    
    toast.success(`Message partagé avec ${selectedConversations.length} conversation(s)`);
    closeShareDialog();
  }, [messageToShare, selectedConversations, user, updateConversationWithMessage, closeShareDialog]);
  
  return {
    messageToShare,
    isShareDialogOpen,
    selectedConversations,
    openShareDialog,
    closeShareDialog,
    toggleConversationSelection,
    shareMessage
  };
};
