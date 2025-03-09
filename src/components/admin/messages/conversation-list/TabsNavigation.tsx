
import React from 'react';
import { MessageSquare, Phone, CircleUser } from 'lucide-react';

interface TabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'CHATS', icon: <MessageSquare className="h-5 w-5" />, label: 'Chats' },
    { id: 'STATUS', icon: <CircleUser className="h-5 w-5" />, label: 'Status' },
    { id: 'APPELS', icon: <Phone className="h-5 w-5" />, label: 'Appels' },
  ];

  return (
    <div className="flex items-center bg-white border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 flex items-center justify-center py-3 px-4 transition-colors ${
            activeTab === tab.id
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <div className="flex flex-col items-center">
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation;
