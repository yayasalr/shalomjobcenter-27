
import { useState } from 'react';
import useConversationLoader from './messages/useConversationLoader';
import { useMessageSender } from './messages/useMessageSender';
import { useConversationManager } from './messages/useConversationManager';

export const useMessages = (userId: string | undefined) => {
  const {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    getUnreadCount,
    markConversationAsRead,
    updateConversationWithMessage
  } = useConversationLoader(userId);

  const {
    newMessage,
    setNewMessage,
    handleSendMessage
  } = useMessageSender(
    userId,
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    updateConversationWithMessage
  );

  const {
    searchQuery,
    setSearchQuery,
    handleSelectConversation,
    onlineUsers,
    isUserOnline
  } = useConversationManager(
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation
  );

  return {
    conversations,
    selectedConversation,
    newMessage,
    searchQuery,
    onlineUsers,
    setNewMessage,
    setSearchQuery,
    handleSendMessage,
    handleSelectConversation,
    getUnreadCount,
    isUserOnline
  };
};
