
import { useState, useCallback } from 'react';
import { Conversation, Message } from '@/components/messages/types';

interface SearchOptions {
  searchInSender?: boolean;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}

export const useMessageSearch = (conversations: Conversation[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    searchInSender: true,
    caseSensitive: false,
    wholeWord: false,
    dateRange: {
      start: null,
      end: null
    }
  });
  const [searchResults, setSearchResults] = useState<{
    conversationId: string;
    messages: Message[];
  }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((query: string, options?: Partial<SearchOptions>) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const opts = { ...searchOptions, ...options };
    
    const q = opts.caseSensitive ? query : query.toLowerCase();
    
    const results = conversations.map(conv => {
      // Filtrer les messages qui correspondent à la recherche
      const matchedMessages = conv.messages.filter(msg => {
        let content = opts.caseSensitive ? msg.content : msg.content.toLowerCase();
        
        // Options de recherche mot entier
        if (opts.wholeWord) {
          const regex = opts.caseSensitive 
            ? new RegExp(`\\b${query}\\b`) 
            : new RegExp(`\\b${query}\\b`, 'i');
          if (!regex.test(msg.content)) {
            return false;
          }
        } else if (!content.includes(q)) {
          return false;
        }
        
        // Filtre par plage de dates
        if (opts.dateRange?.start || opts.dateRange?.end) {
          const msgDate = new Date(msg.timestamp);
          if (opts.dateRange.start && msgDate < opts.dateRange.start) {
            return false;
          }
          if (opts.dateRange.end && msgDate > opts.dateRange.end) {
            return false;
          }
        }
        
        return true;
      });
      
      return {
        conversationId: conv.id,
        conversationName: conv.with.name,
        messages: matchedMessages
      };
    }).filter(result => result.messages.length > 0);
    
    setSearchResults(results);
    setIsSearching(false);
  }, [conversations, searchOptions]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchOptions,
    setSearchOptions,
    searchResults,
    isSearching,
    handleSearch,
    clearSearch
  };
};
