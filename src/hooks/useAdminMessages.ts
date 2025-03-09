
import { useState, useEffect, useCallback } from 'react';
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
  
  // Fonction pour charger et actualiser les conversations
  const loadAndRefreshConversations = useCallback(() => {
    const allUserConversations = loadAdminConversations();
    console.log('Admin conversations refreshed:', allUserConversations.length);
    
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
  }, [selectedConversation]);
  
  // Charger les conversations au démarrage
  useEffect(() => {
    loadAndRefreshConversations();
    
    // Configurer un intervalle pour vérifier périodiquement les nouveaux messages (plus fréquent)
    const interval = setInterval(() => {
      loadAndRefreshConversations();
    }, 1000); // Vérifier toutes les secondes pour une mise à jour plus réactive
    
    // Écouter l'événement personnalisé pour les mises à jour de messages admin
    const handleAdminMessagesUpdated = () => {
      console.log('Admin messages updated event received');
      loadAndRefreshConversations();
    };
    
    // Écouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (e.key.startsWith('conversations_') || e.key === 'admin_conversations')) {
        console.log('Storage change detected:', e.key);
        loadAndRefreshConversations();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('admin-messages-updated', handleAdminMessagesUpdated);
    
    // Créer un canal pour la communication entre les onglets
    const channel = new BroadcastChannel('admin-messaging-channel');
    channel.onmessage = (event) => {
      if (event.data.type === 'refresh-conversations') {
        console.log('Broadcast message received to refresh conversations');
        loadAndRefreshConversations();
      }
    };
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin-messages-updated', handleAdminMessagesUpdated);
      channel.close();
    };
  }, [loadAndRefreshConversations]);

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
    getUnreadCount,
    refreshConversations: loadAndRefreshConversations
  };
};
