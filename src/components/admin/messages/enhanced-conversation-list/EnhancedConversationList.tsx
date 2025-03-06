
import React from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { AdvancedSearch } from '../AdvancedSearch';
import { SearchBar } from './SearchBar';
import { FilterTabs } from './FilterTabs';
import { ConversationListContent } from './ConversationListContent';

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
  performAdvancedSearch
}) => {
  // Filter conversations based on search query and selected filter
  const filteredConversations = conversations.filter(conv => {
    // Filter by search
    const matchesSearch = 
      conv.with.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (filter === 'unread') {
      return matchesSearch && getUnreadCount(conv) > 0;
    }
    
    if (filter === 'important') {
      return matchesSearch && markedImportant[conv.id];
    }
    
    return matchesSearch;
  });

  // Calculate statistics
  const totalUnread = conversations.reduce((total, conv) => total + getUnreadCount(conv), 0);
  const totalImportant = Object.keys(markedImportant).length;
  
  // Handle advanced search
  const openAdvancedSearch = () => {
    setIsAdvancedSearchOpen(true);
  };
  
  const handleAdvancedSearch = (query: string) => {
    setAdvancedSearchQuery(query);
    return performAdvancedSearch(query);
  };

  return (
    <div className="border-r rounded-l-lg">
      <div className="p-4 border-b">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openAdvancedSearch={openAdvancedSearch}
        />
        
        <FilterTabs 
          filter={filter}
          setFilter={setFilter}
          totalUnread={totalUnread}
          totalImportant={totalImportant}
        />
      </div>
      
      <ConversationListContent
        filteredConversations={filteredConversations}
        selectedConversation={selectedConversation}
        handleSelectConversation={handleSelectConversation}
        getUnreadCount={getUnreadCount}
        onlineUsers={onlineUsers}
        markedImportant={markedImportant}
        toggleImportant={toggleImportant}
        filter={filter}
      />
      
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        setIsOpen={setIsAdvancedSearchOpen}
        onSearch={handleAdvancedSearch}
        searchResults={searchResults}
        onSelectResult={(conversationId) => {
          const conversation = conversations.find(c => c.id === conversationId);
          if (conversation) {
            handleSelectConversation(conversation);
          }
        }}
      />
    </div>
  );
};
