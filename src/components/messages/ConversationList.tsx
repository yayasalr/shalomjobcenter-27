
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Users, MessageCircle, Phone } from 'lucide-react';
import { Conversation } from './types';
import WhatsAppConversationItem from './WhatsAppConversationItem';

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
  const [activeTab, setActiveTab] = useState('chats');
  
  // Simulation aléatoire de l'état en ligne
  const [onlineUsers] = useState<Record<string, boolean>>(() => {
    const online: Record<string, boolean> = {};
    conversations.forEach(conv => {
      online[conv.id] = Math.random() > 0.5;
    });
    return online;
  });
  
  const filteredConversations = conversations.filter(
    conversation => conversation.with.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border-r h-full flex flex-col bg-white">
      <div className="p-3 bg-emerald-600">
        <div className="relative">
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/90 border-0 focus-visible:ring-0"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>
      
      <div className="whatsapp-tabs">
        <button 
          className={`whatsapp-tab ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          <div className="flex flex-col items-center">
            <MessageCircle className="h-5 w-5 mb-1" />
            <span>CHATS</span>
          </div>
        </button>
        
        <button 
          className={`whatsapp-tab ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          <div className="flex flex-col items-center">
            <Users className="h-5 w-5 mb-1" />
            <span>STATUS</span>
          </div>
        </button>
        
        <button 
          className={`whatsapp-tab ${activeTab === 'calls' ? 'active' : ''}`}
          onClick={() => setActiveTab('calls')}
        >
          <div className="flex flex-col items-center">
            <Phone className="h-5 w-5 mb-1" />
            <span>CALLS</span>
          </div>
        </button>
      </div>
      
      {activeTab === 'chats' && (
        <ScrollArea className="flex-1">
          <div className="whatsapp-conversation-list">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucune conversation trouvée
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <WhatsAppConversationItem 
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversation?.id === conversation.id}
                  unreadCount={getUnreadCount(conversation)}
                  onClick={() => handleSelectConversation(conversation)}
                  isOnline={onlineUsers[conversation.id]}
                />
              ))
            )}
          </div>
        </ScrollArea>
      )}
      
      {activeTab === 'status' && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Fonctionnalité Status à venir
        </div>
      )}
      
      {activeTab === 'calls' && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Fonctionnalité Appels à venir
        </div>
      )}
    </div>
  );
};

export default ConversationList;
