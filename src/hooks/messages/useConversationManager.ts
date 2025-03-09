
import { useState, useCallback, useEffect } from 'react';
import { Conversation } from '@/components/messages/types';

export const useConversationManager = (
  conversations: Conversation[],
  selectedConversation: Conversation | null,
  setSelectedConversation: (conversation: Conversation | null) => void,
  markConversationAsRead: (conversationId: string) => void
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  // Simulate online status for users
  useEffect(() => {
    const simulateOnlineStatus = () => {
      const online: Record<string, boolean> = {};
      conversations.forEach(conv => {
        // Randomly set some users as online (for demo purposes)
        online[conv.with.id] = Math.random() > 0.5;
      });
      setOnlineUsers(online);
    };

    simulateOnlineStatus();
    const interval = setInterval(simulateOnlineStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [conversations]);

  // Handle selecting a conversation
  const handleSelectConversation = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Mark conversation as read when selected
    if (conversation && !conversation.lastMessage.read) {
      markConversationAsRead(conversation.id);
    }
  }, [setSelectedConversation, markConversationAsRead]);

  // Check if a user is online
  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers[userId] || false;
  }, [onlineUsers]);

  return {
    searchQuery,
    setSearchQuery,
    handleSelectConversation,
    onlineUsers,
    isUserOnline
  };
};
