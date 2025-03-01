
import { useState, useEffect } from 'react';
import { Conversation, Message, ADMIN_USER, WELCOME_BOT } from '@/components/messages/types';
import { toast } from 'sonner';

export const useMessages = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load conversations from localStorage
  useEffect(() => {
    if (userId) {
      const savedConversations = localStorage.getItem(`conversations_${userId}`);
      
      if (savedConversations) {
        try {
          // Convert date strings to Date objects
          const parsedConversations = JSON.parse(savedConversations, (key, value) => {
            if (key === 'timestamp' && typeof value === 'string') {
              return new Date(value);
            }
            return value;
          });
          
          setConversations(parsedConversations);
          
          if (parsedConversations.length > 0) {
            setSelectedConversation(parsedConversations[0]);
          }
        } catch (error) {
          console.error("Erreur lors de la lecture des conversations:", error);
          initializeDefaultConversations(userId);
        }
      } else {
        // No conversations found, initialize with default conversations
        initializeDefaultConversations(userId);
      }
    }
  }, [userId]);

  // Save conversations to localStorage when they change
  useEffect(() => {
    if (userId && conversations.length > 0) {
      localStorage.setItem(`conversations_${userId}`, JSON.stringify(conversations));
    }
  }, [conversations, userId]);

  // Initialize default conversations for a new user
  const initializeDefaultConversations = (userId: string) => {
    if (!userId) return;

    // Create welcome conversation with bot
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      content: `Bienvenue ${userId} sur SHALOM JOB CENTER ! Nous sommes ravis de vous accueillir. N'hésitez pas à parcourir les offres d'emploi et les logements disponibles. Si vous avez des questions, contactez notre équipe d'assistance.`,
      timestamp: new Date(),
      read: false,
      sender: 'system',
    };

    // Create conversation with admin
    const adminWelcomeMessage: Message = {
      id: `admin-welcome-${Date.now()}`,
      content: `Bonjour ${userId}, je suis l'administrateur de la plateforme. N'hésitez pas à me contacter si vous avez des questions.`,
      timestamp: new Date(),
      read: false,
      sender: 'admin',
    };

    const initialConversations: Conversation[] = [
      {
        id: `welcome-${Date.now()}`,
        with: WELCOME_BOT,
        lastMessage: {
          content: welcomeMessage.content,
          timestamp: welcomeMessage.timestamp,
          read: welcomeMessage.read,
          sender: 'system',
        },
        messages: [welcomeMessage],
      },
      {
        id: `admin-${Date.now()}`,
        with: ADMIN_USER,
        lastMessage: {
          content: adminWelcomeMessage.content,
          timestamp: adminWelcomeMessage.timestamp,
          read: adminWelcomeMessage.read,
          sender: 'admin',
        },
        messages: [adminWelcomeMessage],
      }
    ];

    setConversations(initialConversations);
    setSelectedConversation(initialConversations[0]);
  };

  // Send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !userId) return;
    
    const updatedMessage: Message = {
      id: `m${Date.now()}`,
      content: newMessage,
      timestamp: new Date(),
      read: true,
      sender: 'user',
    };
    
    const updatedConversations: Conversation[] = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, updatedMessage],
          lastMessage: {
            content: newMessage,
            timestamp: new Date(),
            read: true,
            sender: 'user',
          },
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setSelectedConversation(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, updatedMessage],
        lastMessage: {
          content: newMessage,
          timestamp: new Date(),
          read: true,
          sender: 'user',
        },
      };
    });
    
    setNewMessage('');
    
    // Simulate auto-response after 1-3 seconds
    if (selectedConversation.with.id === 'admin' || selectedConversation.with.id === 'welcome-bot') {
      setTimeout(() => {
        const autoResponse: Message = {
          id: `auto-${Date.now()}`,
          content: selectedConversation.with.id === 'admin' 
            ? "Merci pour votre message. Je reviendrai vers vous dès que possible."
            : "Merci de votre intérêt pour nos services. Notre équipe est là pour vous aider !",
          timestamp: new Date(),
          read: false,
          sender: selectedConversation.with.id === 'admin' ? 'admin' : 'system',
        };
        
        const updatedWithResponse: Conversation[] = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              messages: [...conv.messages, updatedMessage, autoResponse],
              lastMessage: {
                content: autoResponse.content,
                timestamp: autoResponse.timestamp,
                read: autoResponse.read,
                sender: autoResponse.sender,
              },
            };
          }
          return conv;
        });
        
        setConversations(updatedWithResponse);
        setSelectedConversation(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, autoResponse],
            lastMessage: {
              content: autoResponse.content,
              timestamp: autoResponse.timestamp,
              read: autoResponse.read,
              sender: autoResponse.sender,
            },
          };
        });
        
        toast.success("Nouveau message reçu");
      }, Math.random() * 2000 + 1000); // Between 1 and 3 seconds
    }
  };

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
