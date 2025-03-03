
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Conversation } from './types';

interface WhatsAppHeaderProps {
  conversation: Conversation;
  isOnline?: boolean;
  onBack?: () => void;
}

const WhatsAppHeader: React.FC<WhatsAppHeaderProps> = ({ 
  conversation, 
  isOnline = false,
  onBack 
}) => {
  return (
    <div className="whatsapp-header">
      {onBack && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="whatsapp-back-button text-white"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <div className="flex items-center flex-1">
        <div className="relative">
          <Avatar className="whatsapp-user-avatar">
            <AvatarImage src={conversation.with.avatar || '/placeholder.svg'} />
            <AvatarFallback>
              {conversation.with.name ? conversation.with.name.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
          {isOnline && <div className="whatsapp-online-indicator"></div>}
          {!isOnline && <div className="whatsapp-offline-indicator"></div>}
        </div>
        
        <div className="whatsapp-user-info">
          <h3 className="font-semibold text-white">{conversation.with.name}</h3>
          <div className="text-xs text-white/80">
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-white">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppHeader;
