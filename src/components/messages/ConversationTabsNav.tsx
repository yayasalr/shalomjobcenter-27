
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Phone, Image } from 'lucide-react';

interface ConversationTabsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ConversationTabsNav: React.FC<ConversationTabsNavProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
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
  );
};

export default ConversationTabsNav;
