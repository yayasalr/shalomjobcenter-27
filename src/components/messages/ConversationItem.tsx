import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Conversation } from './types';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  unreadCount: number;
  onClick: () => void;
  isOnline?: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  unreadCount,
  onClick,
  isOnline = false
}) => {
  // Format the timestamp to a readable format
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const messageDate = new Date(date).getTime();
    
    if (messageDate >= today) {
      // If the message is from today, show the time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate >= today - 86400000) {
      // If the message is from yesterday, show "Yesterday"
      return "Hier";
    } else {
      // Otherwise show the date
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div 
      className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-gray-100' : ''}`} 
      onClick={onClick}
    >
      <div className="relative mr-3">
        <Avatar className="h-10 w-10">
          <img 
            src={conversation.with.avatar || '/placeholder.svg'} 
            alt={conversation.with.name} 
            className="h-full w-full object-cover"
          />
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{conversation.with.name}</h3>
          <span className="text-xs text-gray-500">
            {formatTimestamp(new Date(conversation.lastMessage.timestamp))}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage.content}
          </p>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full text-xs h-5 min-w-5 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
