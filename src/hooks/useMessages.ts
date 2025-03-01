
import { useConversationLoader } from './messages/useConversationLoader';
import { useMessageSender } from './messages/useMessageSender';
import { useConversationManager } from './messages/useConversationManager';

export const useMessages = (userId: string | undefined) => {
  const {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation
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
    setSelectedConversation
  );

  const {
    searchQuery,
    setSearchQuery,
    handleSelectConversation,
    getUnreadCount
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
    setNewMessage,
    setSearchQuery,
    handleSendMessage,
    handleSelectConversation,
    getUnreadCount
  };
};
