
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Settings } from 'lucide-react';
import { AllUsersDialog } from './AllUsersDialog';

interface ConversationHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsProfileOpen?: (isOpen: boolean) => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  setIsProfileOpen = () => {}
}) => {
  return (
    <>
      <div className="p-3 bg-emerald-600 flex items-center justify-between">
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => setIsProfileOpen(true)}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex gap-2">
          <Settings className="h-5 w-5 text-white cursor-pointer" />
        </div>
        
        <div className="relative flex-1 mx-2">
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/90 border-0 focus-visible:ring-0"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>
      
      <div className="p-2 flex justify-end">
        <AllUsersDialog onSelectUser={() => {}} />
      </div>
    </>
  );
};

export default ConversationHeader;
