
import React from 'react';
import { Conversation } from '@/components/messages/types';
import { Avatar } from '@/components/ui/avatar';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationHeaderProps {
  conversation: Conversation;
  isOnline: boolean;
  onBackClick: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  isOnline,
  onBackClick
}) => {
  return (
    <div className="whatsapp-header">
      <div className="whatsapp-header-left">
        <Button 
          variant="ghost" 
          size="icon"
          className="back-button p-0 text-white hover:bg-[#00705c]"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10 border-2 border-white/10">
          <img 
            src={conversation.with.avatar || '/placeholder.svg'} 
            alt={conversation.with.name}
            className="h-full w-full object-cover"
          />
        </Avatar>
        
        <div className="whatsapp-user-info">
          <div className="whatsapp-user-name">{conversation.with.name}</div>
          <div className={`whatsapp-user-status ${isOnline ? 'whatsapp-online' : 'whatsapp-offline'}`}>
            <span className="whatsapp-status-dot"></span>
            <span className="whatsapp-status-text">
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="whatsapp-header-right">
        <Button variant="ghost" size="icon" className="p-0 text-white hover:bg-[#00705c]">
          <Phone className="h-5 w-5 whatsapp-header-icon" />
        </Button>
        
        <Button variant="ghost" size="icon" className="p-0 text-white hover:bg-[#00705c]">
          <Video className="h-5 w-5 whatsapp-header-icon" />
        </Button>
        
        <Button variant="ghost" size="icon" className="p-0 text-white hover:bg-[#00705c]">
          <MoreVertical className="h-5 w-5 whatsapp-header-icon" />
        </Button>
      </div>
    </div>
  );
};
