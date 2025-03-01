
import { useState, useEffect } from 'react';
import { Conversation } from '@/components/messages/types';
import { 
  loadAdminConversations, 
  getUnreadCount, 
  getTotalUnreadCount 
} from '@/utils/adminMessageUtils';
import { useAdminConversationActions } from './useAdminConversationActions';

export const useAdminMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  // Charger les conversations depuis le localStorage
  useEffect(() => {
    const allUserConversations = loadAdminConversations();
    setConversations(allUserConversations);
    
    if (allUserConversations.length > 0) {
      setSelectedConversation(allUserConversations[0]);
    }
  }, []);

  const { handleSendMessage, handleSelectConversation } = useAdminConversationActions(
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    newMessage,
    setNewMessage
  );

  // Compter le total des messages non lus
  const totalUnreadCount = getTotalUnreadCount(conversations);

  return {
    conversations,
    selectedConversation,
    newMessage,
    searchQuery,
    filter,
    totalUnreadCount,
    setNewMessage,
    setSearchQuery,
    setFilter,
    handleSendMessage,
    handleSelectConversation,
    getUnreadCount
  };
};
