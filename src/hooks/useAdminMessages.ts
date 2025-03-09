
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
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Charger les conversations depuis le localStorage
  useEffect(() => {
    const loadAndRefreshConversations = () => {
      const allUserConversations = loadAdminConversations();
      setConversations(allUserConversations);
      
      if (allUserConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(allUserConversations[0]);
      } else if (selectedConversation) {
        // Si une conversation est déjà sélectionnée, mettre à jour ses données
        const updatedSelectedConv = allUserConversations.find(
          conv => conv.id === selectedConversation.id
        );
        if (updatedSelectedConv) {
          setSelectedConversation(updatedSelectedConv);
        }
      }
    };
    
    // Charger les conversations au démarrage
    loadAndRefreshConversations();
    
    // Configurer un intervalle pour vérifier périodiquement les nouveaux messages
    const interval = setInterval(() => {
      loadAndRefreshConversations();
    }, 2000); // Vérifier toutes les 2 secondes (plus fréquent pour être plus réactif)
    
    // Ajouter un écouteur d'événements pour les mises à jour de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_conversations') {
        loadAndRefreshConversations();
      }
    };
    
    // Écouter l'événement personnalisé pour les mises à jour de messages admin
    const handleAdminMessagesUpdated = () => {
      loadAndRefreshConversations();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('admin-messages-updated', handleAdminMessagesUpdated);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin-messages-updated', handleAdminMessagesUpdated);
    };
  }, [selectedConversation]);

  const { 
    handleSendMessage, 
    handleSelectConversation,
    sendingMessage: sendingMsg 
  } = useAdminConversationActions(
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    newMessage,
    setNewMessage
  );

  // Mettre à jour l'état d'envoi
  useEffect(() => {
    setSendingMessage(sendingMsg);
  }, [sendingMsg]);

  // Compter le total des messages non lus
  const totalUnreadCount = getTotalUnreadCount(conversations);

  return {
    conversations,
    selectedConversation,
    newMessage,
    searchQuery,
    filter,
    totalUnreadCount,
    sendingMessage,
    setNewMessage,
    setSearchQuery,
    setFilter,
    handleSendMessage,
    handleSelectConversation,
    getUnreadCount
  };
};
