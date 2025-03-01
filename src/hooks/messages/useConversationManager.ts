
import { useState } from 'react';
import { Conversation } from '@/components/messages/types';

export const useConversationManager = (
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mark messages as read when a conversation is selected
  const handleSelectConversation = (conversation: Conversation) => {
    // Mark all messages as read
    const updatedConversations: Conversation[] = conversations.map(conv => {
      if (conv.id === conversation.id && !conv.lastMessage.read) {
        const updatedMessages = conv.messages.map(msg => ({
          ...msg,
          read: true
        }));
        
        return {
          ...conv,
          messages: updatedMessages,
          lastMessage: {
            ...conv.lastMessage,
            read: true
          }
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setSelectedConversation(conversation);
  };

  // Count unread messages
  const getUnreadCount = (conversation: Conversation) => {
    return conversation.messages.filter(msg => !msg.read && (msg.sender === 'other' || msg.sender === 'admin' || msg.sender === 'system')).length;
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSelectConversation,
    getUnreadCount
  };
};
