
import React, { useState, useMemo } from 'react';
import { Search, Plus, MessageCircle, Phone, Image } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Conversation } from './types';
import ConversationTabsNav from './ConversationTabsNav';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AllUsersDialog } from './AllUsersDialog';
import { Status } from './tabs/status/types';
import StatusTabContent from './tabs/StatusTabContent';
import CallsTabContent from './tabs/CallsTabContent';
import ChatsTabContent from './tabs/ChatsTabContent';

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
  getUnreadCount,
}) => {
  const [activeTab, setActiveTab] = useState<string>('chats');
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
  
  const [statuses, setStatuses] = useState<Status[]>(() => {
    const now = new Date();
    
    return [
      {
        id: 1,
        user: "Marie Dupont",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 30),
        content: "En réunion toute la journée, merci de me contacter par email.",
        image: "/placeholder.svg" // Add default image
      },
      {
        id: 2,
        user: "Thomas Martin",
        avatar: "/placeholder.svg",
        isViewed: true,
        timestamp: new Date(now.getTime() - 1000 * 60 * 120),
        image: "/placeholder.svg"
      },
      {
        id: 3,
        user: "Sophie Bernard",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 240),
        content: "Vacances en Italie! 🌞🍕",
        image: "/placeholder.svg"
      }
    ];
  });

  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (conversation) => 
        conversation.with.name.toLowerCase().includes(query) ||
        conversation.lastMessage.content.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const handleViewStatus = (status: Status) => {
    setStatuses(currentStatuses => 
      currentStatuses.map(s => 
        s.id === status.id ? { ...s, isViewed: true } : s
      )
    );
  };

  const handleStatusCreated = (newStatus: Status) => {
    setStatuses(currentStatuses => [newStatus, ...currentStatuses]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="chats" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-1" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="statuses" className="flex-1">
              <Image className="h-4 w-4 mr-1" />
              Status
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex-1">
              <Phone className="h-4 w-4 mr-1" />
              Appels
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeTab === 'chats' && (
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une conversation..."
              className="pl-9"
            />
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chats' && (
          <ChatsTabContent 
            filteredConversations={filteredConversations}
            selectedConversation={selectedConversation}
            handleSelectConversation={handleSelectConversation}
            getUnreadCount={getUnreadCount}
            onlineUsers={onlineUsers}
          />
        )}
        
        {activeTab === 'statuses' && (
          <StatusTabContent 
            statuses={statuses}
            onViewStatus={handleViewStatus}
            onStatusCreated={handleStatusCreated}
          />
        )}
        
        {activeTab === 'calls' && (
          <CallsTabContent calls={[]} />
        )}
      </div>
      
      {activeTab === 'chats' && (
        <div className="p-3 border-t">
          <Button 
            onClick={() => setShowAllUsers(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle conversation
          </Button>
        </div>
      )}
      
      <AllUsersDialog
        onOpenChange={setShowAllUsers}
        open={showAllUsers}
        onSelectUser={(user) => {
          console.log("Selected user for new conversation:", user);
          setShowAllUsers(false);
        }}
      />
    </div>
  );
};

export default ConversationList;
