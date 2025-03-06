
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Users, Phone } from 'lucide-react';

interface ConversationTabsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ConversationTabsNav: React.FC<ConversationTabsNavProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <TabsList className="grid grid-cols-3 whatsapp-tabs">
      <TabsTrigger value="chats" className="whatsapp-tab">
        <div className="flex flex-col items-center">
          <MessageCircle className="h-5 w-5 mb-1" />
          <span>CHATS</span>
        </div>
      </TabsTrigger>
      
      <TabsTrigger value="status" className="whatsapp-tab">
        <div className="flex flex-col items-center">
          <Users className="h-5 w-5 mb-1" />
          <span>STATUS</span>
        </div>
      </TabsTrigger>
      
      <TabsTrigger value="calls" className="whatsapp-tab">
        <div className="flex flex-col items-center">
          <Phone className="h-5 w-5 mb-1" />
          <span>CALLS</span>
        </div>
      </TabsTrigger>
    </TabsList>
  );
};

export default ConversationTabsNav;
