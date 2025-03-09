
import { useState, useEffect } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import useLocalStorage from '../useLocalStorage';

const useConversationLoader = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load conversations from localStorage when the component mounts
  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setSelectedConversation(null);
      setIsLoading(false);
      return;
    }

    try {
      // Load conversations from localStorage
      const storedConversations = localStorage.getItem(`conversations_${userId}`);
      
      if (storedConversations) {
        // Parse the JSON string and handle date conversion
        const parsedConversations = JSON.parse(storedConversations, (key, value) => {
          if (key === 'timestamp' && typeof value === 'string') {
            return new Date(value);
          }
          return value;
        });
        
        setConversations(parsedConversations);
        
        // Select the first conversation if available and none is selected
        if (parsedConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(parsedConversations[0]);
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading conversations'));
      setIsLoading(false);
    }
  }, [userId]);

  // Get unread count for a conversation
  const getUnreadCount = (conversation: Conversation): number => {
    return conversation.messages.filter(msg => !msg.read && msg.sender !== 'user').length;
  };

  // Mark a conversation as read
  const markConversationAsRead = (conversationId: string) => {
    if (!userId) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        // Mark all messages as read
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
    
    // Update in localStorage
    localStorage.setItem(`conversations_${userId}`, JSON.stringify(updatedConversations));
    
    // Update selected conversation if it's the one being marked as read
    if (selectedConversation && selectedConversation.id === conversationId) {
      const updatedSelectedConv = updatedConversations.find(
        conv => conv.id === conversationId
      );
      if (updatedSelectedConv) {
        setSelectedConversation(updatedSelectedConv);
      }
    }
  };

  // Update a conversation with a new message
  const updateConversationWithMessage = (
    conversationId: string,
    newMessage: Message
  ) => {
    if (!userId) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: {
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            read: newMessage.read,
            sender: newMessage.sender
          }
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    
    // Update in localStorage
    localStorage.setItem(`conversations_${userId}`, JSON.stringify(updatedConversations));
    
    // Update selected conversation if it's the one being updated
    if (selectedConversation && selectedConversation.id === conversationId) {
      const updatedSelectedConv = updatedConversations.find(
        conv => conv.id === conversationId
      );
      if (updatedSelectedConv) {
        setSelectedConversation(updatedSelectedConv);
      }
    }
  };

  return {
    isLoading,
    error,
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    getUnreadCount,
    markConversationAsRead,
    updateConversationWithMessage
  };
};

export default useConversationLoader;
