
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Conversation } from './types';

interface WhatsAppConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  unreadCount: number;
  onClick: () => void;
  isOnline: boolean;
}

const WhatsAppConversationItem: React.FC<WhatsAppConversationItemProps> = ({
  conversation,
  isSelected,
  unreadCount,
  onClick,
  isOnline
}) => {
  // Format the timestamp to a readable format
  const formatTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
  };

  // Get sender name for the last message
  const getSenderPrefix = () => {
    if (conversation.lastMessage.sender === 'user') {
      return 'Vous: ';
    }
    return '';
  };

  // Get message status icon
  const getMessageStatusIcon = () => {
    if (conversation.lastMessage.sender !== 'user') {
      return null;
    }
    
    if (conversation.lastMessage.read) {
      return (
        <span className="whatsapp-tick whatsapp-tick-read inline-flex">
          <Check className="h-3 w-3" />
          <Check className="h-3 w-3 -ml-1" />
        </span>
      );
    } else {
      return (
        <span className="whatsapp-tick whatsapp-tick-delivered inline-flex">
          <Check className="h-3 w-3" />
          <Check className="h-3 w-3 -ml-1" />
        </span>
      );
    }
  };

  return (
    <div 
      className={`whatsapp-conversation-item py-3 px-4 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
        isSelected ? 'bg-gray-100 dark:bg-gray-800' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative mr-3 flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.with.avatar || '/placeholder.svg'} alt={conversation.with.name} />
          <AvatarFallback>{conversation.with.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[var(--whatsapp-online)] border-2 border-white dark:border-gray-900"></span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {conversation.with.name}
          </h3>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatTime(new Date(conversation.lastMessage.timestamp))}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <p className={`text-sm ${unreadCount > 0 ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'} truncate max-w-[80%]`}>
            {getSenderPrefix()}{conversation.lastMessage.content}
            {getMessageStatusIcon()}
          </p>
          
          {unreadCount > 0 && (
            <Badge className="bg-[var(--whatsapp-green)] hover:bg-[var(--whatsapp-green)] rounded-full text-xs h-5 min-w-5 flex items-center justify-center px-1.5">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConversationItem;
