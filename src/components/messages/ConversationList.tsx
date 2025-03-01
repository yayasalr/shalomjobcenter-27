
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Conversation } from './types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSelectConversation: (conversation: Conversation) => void;
  getUnreadCount: (conversation: Conversation) => number;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  searchQuery,
  setSearchQuery,
  handleSelectConversation,
  getUnreadCount
}) => {
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.with.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            className="pl-9" 
            placeholder="Rechercher dans les messages..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(80vh-16rem)]">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => {
            const unreadCount = getUnreadCount(conversation);
            
            return (
              <div 
                key={conversation.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                  selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.with.avatar} />
                      <AvatarFallback className={
                        conversation.with.role === 'admin' ? 'bg-blue-500 text-white' : ''
                      }>
                        {conversation.with.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.with.role === 'admin' && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-blue-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate flex items-center">
                        {conversation.with.name}
                        {conversation.with.role === 'admin' && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">Admin</Badge>
                        )}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessage.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p className={`text-sm truncate ${
                        !conversation.lastMessage.read && conversation.lastMessage.sender !== 'user' 
                          ? 'font-medium' 
                          : 'text-gray-500'
                      }`}>
                        {conversation.lastMessage.sender === 'user' ? 'Vous: ' : ''}
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
            Aucune conversation trouvée
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
