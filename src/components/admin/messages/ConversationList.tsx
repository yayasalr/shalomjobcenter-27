
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/components/messages/types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: 'all' | 'unread';
  setFilter: (filter: 'all' | 'unread') => void;
  handleSelectConversation: (conversation: Conversation) => void;
  getUnreadCount: (conversation: Conversation) => number;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  handleSelectConversation,
  getUnreadCount
}) => {
  // Filter conversations based on search query and filter
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.with.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.with.email && conv.with.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') {
      const hasUnread = conv.messages.some(msg => !msg.read && msg.sender === 'user');
      return matchesSearch && hasUnread;
    }
    
    return matchesSearch;
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-9" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant={filter === 'unread' ? "default" : "outline"} 
            size="icon"
            onClick={() => setFilter(filter === 'unread' ? 'all' : 'unread')}
            className="h-10 w-10"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {filteredConversations.length} conversation(s) {filter === 'unread' ? 'non lue(s)' : ''}
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-400px)]">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => {
            const unreadCount = getUnreadCount(conversation);
            
            return (
              <div 
                key={conversation.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                  selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                } ${unreadCount > 0 ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={conversation.with.avatar} />
                    <AvatarFallback>{conversation.with.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{conversation.with.name}</h3>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessage.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{conversation.with.email}</p>
                    <div className="flex justify-between mt-1">
                      <p className={`text-sm truncate ${
                        unreadCount > 0 ? 'font-medium' : 'text-gray-500'
                      }`}>
                        {conversation.lastMessage.sender === 'admin' ? 'Vous: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                      {unreadCount > 0 && (
                        <Badge variant="default" className="rounded-full h-5 w-5 flex items-center justify-center ml-2 p-0">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500">
            Aucune conversation {filter === 'unread' ? 'non lue' : ''} trouvée
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
