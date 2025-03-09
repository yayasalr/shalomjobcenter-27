
import React, { useState } from 'react';
import { Conversation } from '@/components/messages/types';
import Header from './conversation-list/Header';
import TabsNavigation from './conversation-list/TabsNavigation';
import SearchBar from './conversation-list/SearchBar';
import ConversationList from './conversation-list/ConversationList';
import NewConversationButton from './conversation-list/NewConversationButton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import StatusTabContent from '@/components/messages/tabs/StatusTabContent';
import CallsTabContent from '@/components/messages/tabs/CallsTabContent';

interface EnhancedConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: 'all' | 'unread' | 'important';
  setFilter: (filter: 'all' | 'unread' | 'important') => void;
  handleSelectConversation: (conversation: Conversation) => void;
  getUnreadCount: (conversation: Conversation) => number;
  onlineUsers: Record<string, boolean>;
  markedImportant: Record<string, boolean>;
  toggleImportant: (conversationId: string) => void;
  isAdvancedSearchOpen: boolean;
  setIsAdvancedSearchOpen: (isOpen: boolean) => void;
  advancedSearchQuery: string;
  setAdvancedSearchQuery: (query: string) => void;
  searchResults: any[];
  performAdvancedSearch: (query: string) => any[];
  handleCreateNewConversation?: () => void;
}

export const EnhancedConversationList: React.FC<EnhancedConversationListProps> = ({
  conversations,
  selectedConversation,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  handleSelectConversation,
  getUnreadCount,
  onlineUsers,
  markedImportant,
  toggleImportant,
  isAdvancedSearchOpen,
  setIsAdvancedSearchOpen,
  advancedSearchQuery,
  setAdvancedSearchQuery,
  searchResults,
  performAdvancedSearch,
  handleCreateNewConversation
}) => {
  const [activeTab, setActiveTab] = useState('CHATS');
  
  // Fonction pour formater la date
  const formatTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Même jour
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // Hier
    else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    }
    // Cette semaine (moins de 7 jours)
    else if (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    // Plus ancien
    else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
  };

  // Gérer les actions des onglets Statut et Appels
  const handleViewStatus = (status: any) => {
    toast.info(`Visualisation du statut de ${status.user}`);
  };

  const handleStatusCreated = (status: any) => {
    toast.success("Statut créé avec succès");
  };

  const handleStartCall = (isVideo: boolean) => {
    toast.info(`Démarrage d'un appel ${isVideo ? 'vidéo' : 'audio'}`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r">
      {/* Header Component */}
      <Header title="Messages" />
      
      {/* Tabs Component */}
      <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'CHATS' && (
        <>
          {/* Search Bar Component */}
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          {/* Conversation List Component */}
          <ConversationList 
            conversations={conversations}
            selectedConversation={selectedConversation}
            handleSelectConversation={handleSelectConversation}
            getUnreadCount={getUnreadCount}
            onlineUsers={onlineUsers}
            searchQuery={searchQuery}
            formatTime={formatTime}
          />
          
          {/* New Conversation Button Component */}
          <NewConversationButton handleCreateNewConversation={handleCreateNewConversation} />
        </>
      )}
      
      {activeTab === 'STATUS' && (
        <StatusTabContent 
          statuses={[]}
          onViewStatus={handleViewStatus}
          onStatusCreated={handleStatusCreated}
        />
      )}
      
      {activeTab === 'APPELS' && (
        <CallsTabContent calls={[]} />
      )}
    </div>
  );
};
