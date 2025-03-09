
import React from 'react';
import { Conversation } from '@/components/messages/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Video } from 'lucide-react';
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
      <div className="flex items-center flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 text-white md:hidden whatsapp-back-button touch-manipulation" 
          onClick={onBackClick}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="relative">
          <Avatar className="whatsapp-user-avatar">
            <AvatarImage src={conversation.with.avatar} />
            <AvatarFallback>
              {conversation.with.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {isOnline && <div className="whatsapp-online-indicator"></div>}
          {!isOnline && <div className="whatsapp-offline-indicator"></div>}
        </div>
        
        <div className="whatsapp-user-info">
          <h3 className="font-semibold text-white truncate">{conversation.with.name}</h3>
          <div className="flex items-center gap-2">
            <div className="text-xs text-white/80">
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </div>
            {conversation.with.role && (
              <Badge variant="outline" className="text-xs bg-emerald-700 text-white border-emerald-600">
                {conversation.with.role === 'admin' ? 'Administrateur' : conversation.with.role}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-white touch-manipulation">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white touch-manipulation">
          <Phone className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
