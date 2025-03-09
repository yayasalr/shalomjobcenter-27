
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Conversation } from './types';

interface ConversationHeaderProps {
  conversation: Conversation;
  isOnline?: boolean;
  onBack?: () => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ 
  conversation, 
  isOnline = false,
  onBack
}) => {
  return (
    <div className="flex items-center p-3 border-b bg-white">
      {onBack && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <div className="relative mr-3">
        <Avatar className="h-10 w-10">
          <img 
            src={conversation.with.avatar || '/placeholder.svg'} 
            alt={conversation.with.name}
            className="h-full w-full object-cover"
          />
        </Avatar>
        {isOnline && (
          <span className="online-indicator"></span>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold">{conversation.with.name}</h3>
        <div className="text-xs text-gray-500">
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
