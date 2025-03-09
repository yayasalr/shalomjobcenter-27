
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Chats
        </TabsTrigger>
        <TabsTrigger 
          value="STATUS" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Status
        </TabsTrigger>
        <TabsTrigger 
          value="APPELS" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Appels
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabsNavigation;
