
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, X, Plus, Users } from 'lucide-react';
import { Conversation } from '@/components/messages/types';
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
    <div className="flex flex-col h-full bg-gray-100 border-r">
      {/* En-tête de la liste */}
      <div className="p-2 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Messages</h2>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full h-10 bg-gray-50 grid grid-cols-3">
          <TabsTrigger value="CHATS" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            Chats
          </TabsTrigger>
          <TabsTrigger value="STATUS" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            Status
          </TabsTrigger>
          <TabsTrigger value="APPELS" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            Appels
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Barre de recherche */}
      <div className="p-2 bg-gray-50">
        <div className="flex items-center bg-white rounded-md overflow-hidden border">
          <Search className="h-4 w-4 ml-3 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher une conversation..."
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
      
      {/* Liste des conversations */}
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>Aucune conversation trouvée. Utilisez le bouton "Nouvelle conversation" ci-dessous pour en démarrer une.</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const unreadCount = getUnreadCount(conversation);
            const isSelected = selectedConversation?.id === conversation.id;
            const isOnline = onlineUsers[conversation.with.id] || false;
            
            return (
              <div
                key={conversation.id}
                className={`p-3 hover:bg-gray-100 cursor-pointer border-b ${isSelected ? 'bg-blue-50' : ''}`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-start">
                  <div className="relative mr-3">
                    <Avatar className="h-12 w-12">
                      <img 
                        src={conversation.with.avatar || '/placeholder.svg'} 
                        alt={conversation.with.name}
                        className="h-full w-full object-cover"
                      />
                    </Avatar>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{conversation.with.name}</h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(new Date(conversation.lastMessage.timestamp))}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.content.length > 40
                          ? conversation.lastMessage.content.substring(0, 40) + "..."
                          : conversation.lastMessage.content}
                      </p>
                      
                      {unreadCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-blue-500">
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
      </ScrollArea>
      
      {/* Bouton pour ajouter une nouvelle conversation */}
      <div className="p-3 border-t bg-gray-50">
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleCreateNewConversation}
        >
          <Plus className="h-4 w-4 mr-2" /> Nouvelle conversation
        </Button>
      </div>
      
      {/* Alternative bottom button for mobile */}
      <div className="md:hidden p-3 border-t bg-white">
        <Button 
          variant="ghost"
          className="w-full flex items-center justify-center"
          onClick={handleCreateNewConversation}
        >
          <Users className="h-4 w-4 mr-2" /> Nouvelle conversation
        </Button>
      </div>
    </div>
  );
};
