
import { useState } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { toast } from 'sonner';

export const useMessageSender = (
  userId: string | undefined,
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const [newMessage, setNewMessage] = useState('');

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

  return {
    newMessage,
    setNewMessage,
    handleSendMessage
  };
};
