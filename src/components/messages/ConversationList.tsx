
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Conversation } from './types';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { toast } from 'sonner';

// Import the components we just created
import ConversationHeader from './ConversationHeader';
import ConversationTabsNav from './ConversationTabsNav';
import ChatsTabContent from './tabs/ChatsTabContent';
import StatusTabContent from './tabs/StatusTabContent';
import CallsTabContent from './tabs/CallsTabContent';

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
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

  const handleProfileImageUpload = (file: File) => {
    setIsUploading(true);
    
    // This would normally upload the image to a server
    setTimeout(() => {
      toast.success("Photo de profil mise à jour");
      setIsUploading(false);
    }, 1500);
  };

  // Mock statuses for the demo
  const statuses = [
    { id: 1, user: 'John Doe', avatar: '/placeholder.svg', isViewed: false, timestamp: new Date() },
    { id: 2, user: 'Jane Smith', avatar: '/placeholder.svg', isViewed: true, timestamp: new Date() },
    { id: 3, user: 'Bob Johnson', avatar: '/placeholder.svg', isViewed: false, timestamp: new Date() }
  ];

  // Mock call history for the demo
  const calls = [
    { id: 1, user: 'John Doe', avatar: '/placeholder.svg', type: 'incoming', timestamp: new Date(), missed: false },
    { id: 2, user: 'Jane Smith', avatar: '/placeholder.svg', type: 'outgoing', timestamp: new Date(), missed: true },
    { id: 3, user: 'Bob Johnson', avatar: '/placeholder.svg', type: 'incoming', timestamp: new Date(), missed: true }
  ];

  return (
    <div className="border-r h-full flex flex-col bg-white md:rounded-l-lg shadow-sm">
      {/* Header with search */}
      <ConversationHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsProfileOpen={setIsProfileOpen}
      />
      
      {/* Tabs container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Tab buttons */}
        <ConversationTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Tab contents */}
        <TabsContent value="chats" className="flex-1 flex flex-col px-0 py-0 mt-0">
          <ChatsTabContent
            filteredConversations={filteredConversations}
            selectedConversation={selectedConversation}
            handleSelectConversation={handleSelectConversation}
            getUnreadCount={getUnreadCount}
            onlineUsers={onlineUsers}
          />
        </TabsContent>
        
        <TabsContent value="status" className="flex-1 flex flex-col px-0 py-0 mt-0">
          <StatusTabContent statuses={statuses} />
        </TabsContent>
        
        <TabsContent value="calls" className="flex-1 flex flex-col px-0 py-0 mt-0">
          <CallsTabContent calls={calls} />
        </TabsContent>
      </Tabs>
      
      {/* Profile dialog would go here */}
    </div>
  );
};

export default ConversationList;
