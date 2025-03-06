
import React, { useState, useEffect } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { AdvancedSearch } from '../AdvancedSearch';
import { SearchBar } from './SearchBar';
import { FilterTabs } from './FilterTabs';
import { ConversationListContent } from './ConversationListContent';
import { toast } from 'sonner';

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
  searchResults: Array<{conversation: Conversation, message: Message}>;
  performAdvancedSearch: (query: string) => Array<{conversation: Conversation, message: Message}>;
  isLoading?: boolean;
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
  isLoading = false
}) => {
  // State pour les conversations filtrées
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  
  // Effet pour filtrer les conversations basé sur la recherche et le filtre
  useEffect(() => {
    const filtered = conversations.filter(conv => {
      // Filtre par recherche
      const matchesSearch = !searchQuery.trim() || 
        conv.with.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre par onglet
      if (filter === 'unread') {
        return matchesSearch && getUnreadCount(conv) > 0;
      }
      
      if (filter === 'important') {
        return matchesSearch && markedImportant[conv.id];
      }
      
      return matchesSearch;
    });
    
    setFilteredConversations(filtered);
  }, [conversations, searchQuery, filter, getUnreadCount, markedImportant]);

  // Calculer les statistiques
  const totalUnread = conversations.reduce((total, conv) => total + getUnreadCount(conv), 0);
  const totalImportant = Object.keys(markedImportant).length;
  
  // Gérer la recherche avancée
  const openAdvancedSearch = () => {
    setIsAdvancedSearchOpen(true);
  };
  
  const handleAdvancedSearch = (query: string) => {
    setAdvancedSearchQuery(query);
    const results = performAdvancedSearch(query);
    
    // Afficher un toast avec le nombre de résultats
    if (results.length > 0) {
      toast.success(`${results.length} résultat(s) trouvé(s)`);
    } else {
      toast.info("Aucun résultat trouvé", {
        description: "Essayez avec d'autres termes de recherche."
      });
    }
    
    return results;
  };

  return (
    <div className="border-r rounded-l-lg h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openAdvancedSearch={openAdvancedSearch}
          placeholder="Rechercher une conversation..."
        />
        
        <FilterTabs 
          filter={filter}
          setFilter={setFilter}
          totalUnread={totalUnread}
          totalImportant={totalImportant}
        />
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ConversationListContent
          filteredConversations={filteredConversations}
          selectedConversation={selectedConversation}
          handleSelectConversation={handleSelectConversation}
          getUnreadCount={getUnreadCount}
          onlineUsers={onlineUsers}
          markedImportant={markedImportant}
          toggleImportant={toggleImportant}
          filter={filter}
          searchQuery={searchQuery}
          isLoading={isLoading}
        />
      </div>
      
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        setIsOpen={setIsAdvancedSearchOpen}
        onSearch={handleAdvancedSearch}
        searchResults={searchResults}
        onSelectResult={(conversationId) => {
          const conversation = conversations.find(c => c.id === conversationId);
          if (conversation) {
            handleSelectConversation(conversation);
            // Fermer la fenêtre de recherche avancée après sélection
            setIsAdvancedSearchOpen(false);
          }
        }}
      />
    </div>
  );
};
