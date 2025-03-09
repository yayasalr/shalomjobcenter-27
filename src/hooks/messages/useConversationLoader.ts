
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../useLocalStorage';
import { Message, Conversation, ADMIN_USER, WELCOME_BOT } from '@/components/messages/types';
import { faker } from '@faker-js/faker';

export const useConversationLoader = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', []);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Initialize with demo data if no conversations exist
  useEffect(() => {
    if (!userId) return;
    
    if (conversations.length === 0) {
      try {
        // Generate some demo conversations
        const demoConversations = generateDemoConversations(userId);
        setConversations(demoConversations);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load conversations'));
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [userId, conversations.length, setConversations]);

  // Get the count of unread messages in a conversation
  const getUnreadCount = useCallback((conversation: Conversation) => {
    return conversation.messages.filter(
      msg => !msg.read && msg.sender !== 'user' && msg.sender !== 'admin'
    ).length;
  }, []);

  // Mark all messages in a conversation as read
  const markConversationAsRead = useCallback((conversationId: string) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === conversationId) {
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
      })
    );
  }, [setConversations]);

  // Update a conversation when a new message is sent
  const updateConversationWithMessage = useCallback((conversationId: string, newMessage: Message) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
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
      })
    );
  }, [setConversations]);

  return {
    isLoading,
    error,
    conversations,
    selectedConversation,
    setSelectedConversation,
    getUnreadCount,
    markConversationAsRead,
    updateConversationWithMessage
  };
};

// Helper to generate demo conversations
const generateDemoConversations = (userId: string): Conversation[] => {
  // Generate a welcome conversation with the welcome bot
  const welcomeConversation: Conversation = {
    id: 'welcome',
    with: WELCOME_BOT,
    messages: [
      {
        id: 'welcome-1',
        content: "Bienvenue sur notre plateforme! Comment puis-je vous aider aujourd'hui?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        sender: 'system'
      }
    ],
    lastMessage: {
      content: "Bienvenue sur notre plateforme! Comment puis-je vous aider aujourd'hui?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      sender: 'system'
    }
  };

  // Generate a conversation with the admin
  const adminConversation: Conversation = {
    id: 'admin',
    with: ADMIN_USER,
    messages: [
      {
        id: 'admin-1',
        content: "Bonjour, je suis l'administrateur du site. N'hésitez pas à me contacter si vous avez des questions!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
        sender: 'admin'
      }
    ],
    lastMessage: {
      content: "Bonjour, je suis l'administrateur du site. N'hésitez pas à me contacter si vous avez des questions!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      read: true,
      sender: 'admin'
    }
  };

  // Generate some random user conversations
  const randomUserConversations: Conversation[] = Array.from({ length: 5 }, (_, i) => {
    const userName = faker.person.fullName();
    const userId = `user-${i + 1}`;
    const lastMessageTime = new Date(Date.now() - 1000 * 60 * 60 * (i + 1)); // Staggered times
    
    const messages: Message[] = [
      {
        id: `msg-${userId}-1`,
        content: faker.lorem.sentence(5),
        timestamp: new Date(lastMessageTime.getTime() - 1000 * 60 * 30),
        read: true,
        sender: 'other'
      },
      {
        id: `msg-${userId}-2`,
        content: faker.lorem.sentence(8),
        timestamp: lastMessageTime,
        read: i > 1, // Some messages are unread
        sender: 'other'
      }
    ];
    
    return {
      id: userId,
      with: {
        id: userId,
        name: userName,
        email: faker.internet.email(),
        avatar: '/placeholder.svg',
        role: 'user'
      },
      messages,
      lastMessage: {
        content: messages[messages.length - 1].content,
        timestamp: messages[messages.length - 1].timestamp,
        read: messages[messages.length - 1].read,
        sender: messages[messages.length - 1].sender
      }
    };
  });

  return [welcomeConversation, adminConversation, ...randomUserConversations];
};

export default useConversationLoader;
