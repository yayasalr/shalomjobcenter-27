
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SearchX, Search, Users, UserPlus, Filter, Star, StarOff, X } from 'lucide-react';
import { Conversation } from '@/components/messages/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [activeTab, setActiveTab] = useState('CHATS');
  
  // Filtrer les conversations selon le filtre actif
  const filteredConversations = conversations.filter(conversation => {
    // Filtre de recherche
    const matchesSearch = conversation.with.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtres additionnels
    if (filter === 'unread') {
      return matchesSearch && getUnreadCount(conversation) > 0;
    } else if (filter === 'important') {
      return matchesSearch && markedImportant[conversation.id];
    }
    
    return matchesSearch;
  });

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

  return (
    <div className="whatsapp-conversation-list md:col-span-1 border-r h-full flex flex-col">
      {/* En-tête avec search */}
      <div className="whatsapp-header p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 bg-white text-whatsapp-header">
              <img 
                src="/lovable-uploads/dbf22855-389b-4512-820a-abe3f147a780.png" 
                alt="Admin" 
                className="h-full w-full object-cover"
              />
            </Avatar>
          </div>
          
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="p-0 text-white hover:bg-[#00705c]">
              <Users className="h-5 w-5 whatsapp-header-icon" />
            </Button>
            <Button variant="ghost" size="icon" className="p-0 text-white hover:bg-[#00705c]">
              <UserPlus className="h-5 w-5 whatsapp-header-icon" />
            </Button>
            <Button variant="ghost" size="icon" className="p-0 text-white hover:bg-[#00705c]">
              <Filter className="h-5 w-5 whatsapp-header-icon" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Barre de recherche */}
      <div className="p-2 bg-[#f0f2f5]">
        <div className="flex items-center bg-white rounded-md overflow-hidden">
          <Search className="h-5 w-5 ml-3 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher ou démarrer une nouvelle discussion"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 mr-1"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full rounded-none h-12 bg-[#f0f2f5] p-0 gap-0">
          <TabsTrigger 
            value="CHATS" 
            className="flex-1 h-full rounded-none data-[state=active]:text-[#00a884] data-[state=active]:border-b-2 data-[state=active]:border-[#00a884] data-[state=active]:bg-transparent font-semibold data-[state=active]:shadow-none"
          >
            CHATS
          </TabsTrigger>
          <TabsTrigger 
            value="STATUT" 
            className="flex-1 h-full rounded-none data-[state=active]:text-[#00a884] data-[state=active]:border-b-2 data-[state=active]:border-[#00a884] data-[state=active]:bg-transparent font-semibold data-[state=active]:shadow-none"
          >
            STATUT
          </TabsTrigger>
          <TabsTrigger 
            value="APPELS" 
            className="flex-1 h-full rounded-none data-[state=active]:text-[#00a884] data-[state=active]:border-b-2 data-[state=active]:border-[#00a884] data-[state=active]:bg-transparent font-semibold data-[state=active]:shadow-none"
          >
            APPELS
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Liste des discussions */}
      <ScrollArea className="flex-1">
        <div className="space-y-0 py-0">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? "Aucune conversation trouvée" : "Aucune conversation"}
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const unreadCount = getUnreadCount(conversation);
              const isSelected = selectedConversation?.id === conversation.id;
              const isOnline = onlineUsers[conversation.with.id] || false;
              const isImportant = markedImportant[conversation.id];
              
              return (
                <div
                  key={conversation.id}
                  className={`whatsapp-conversation-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="whatsapp-conversation-avatar">
                    <Avatar className="h-12 w-12">
                      <img 
                        src={conversation.with.avatar || '/placeholder.svg'} 
                        alt={conversation.with.name}
                        className="h-full w-full object-cover"
                      />
                    </Avatar>
                    {isOnline && <div className="online-indicator"></div>}
                  </div>
                  
                  <div className="whatsapp-conversation-content">
                    <div className="whatsapp-conversation-header">
                      <span className="whatsapp-conversation-name">
                        {conversation.with.name}
                      </span>
                      <span className="whatsapp-conversation-time">
                        {formatTime(new Date(conversation.lastMessage.timestamp))}
                      </span>
                    </div>
                    
                    <div className="whatsapp-conversation-message">
                      <p className="whatsapp-conversation-excerpt">
                        {conversation.lastMessage.content.length > 40
                          ? conversation.lastMessage.content.substring(0, 40) + "..."
                          : conversation.lastMessage.content}
                      </p>
                      
                      <div className="flex items-center gap-1">
                        {isImportant && (
                          <Star className="h-4 w-4 text-[#00a884]" />
                        )}
                        
                        {unreadCount > 0 && (
                          <Badge 
                            className="h-5 w-5 flex items-center justify-center p-0 rounded-full bg-[#00a884] hover:bg-[#00a884]"
                          >
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
