
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, User, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VoiceSearchButton } from '@/components/messages/VoiceSearchButton';

interface ConversationHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsProfileOpen: (isOpen: boolean) => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  setIsProfileOpen
}) => {
  const handleVoiceResult = (result: string) => {
    setSearchQuery(result);
  };

  return (
    <div className="whatsapp-conversation-list-header">
      <div 
        className="whatsapp-profile-button"
        onClick={() => setIsProfileOpen(true)}
      >
        <Avatar>
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="whatsapp-search-box">
        <Search className="whatsapp-search-icon h-4 w-4" />
        <Input
          type="text"
          placeholder="Rechercher ou démarrer une nouvelle conversation"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="whatsapp-search-input"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <VoiceSearchButton onResult={handleVoiceResult} />
        </div>
      </div>
      
      <Button variant="ghost" size="icon" className="text-white">
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ConversationHeader;
