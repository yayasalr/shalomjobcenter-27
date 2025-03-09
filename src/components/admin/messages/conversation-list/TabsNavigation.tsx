
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Image, Phone } from 'lucide-react';

interface TabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full h-10 bg-gray-50 grid grid-cols-3">
        <TabsTrigger 
          value="CHATS" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center justify-center"
        >
          <MessageCircle className="h-4 w-4 mr-2" /> Chats
        </TabsTrigger>
        <TabsTrigger 
          value="STATUS" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center justify-center"
        >
          <Image className="h-4 w-4 mr-2" /> Status
        </TabsTrigger>
        <TabsTrigger 
          value="APPELS" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center justify-center"
        >
          <Phone className="h-4 w-4 mr-2" /> Appels
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabsNavigation;
