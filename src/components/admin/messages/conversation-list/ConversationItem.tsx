
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/components/messages/types';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  unreadCount: number;
  isOnline: boolean;
  onClick: () => void;
  formatTime: (date: Date) => string;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  unreadCount,
  isOnline,
  onClick,
  formatTime
}) => {
  return (
    <div
      className={`p-3 hover:bg-gray-100 cursor-pointer border-b ${isSelected ? 'bg-blue-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="relative mr-3">
          <Avatar className="h-12 w-12">
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
              {formatTime(new Date(conversation.lastMessage.timestamp))}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-600 truncate">
              {conversation.lastMessage.content.length > 40
                ? conversation.lastMessage.content.substring(0, 40) + "..."
                : conversation.lastMessage.content}
            </p>
            
            {unreadCount > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-blue-500">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
