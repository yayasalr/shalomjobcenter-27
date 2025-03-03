
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/components/messages/types';
import { OnlineStatusIndicator } from './OnlineStatusIndicator';
import { Star, StarOff } from 'lucide-react';

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  unreadCount: number;
  onSelect: () => void;
  isOnline: boolean;
  isImportant: boolean;
  onToggleImportant: () => void;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isSelected,
  unreadCount,
  onSelect,
  isOnline,
  isImportant,
  onToggleImportant
}) => {
  // Empêcher la propagation du clic pour le bouton de marquage d'importance
  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleImportant();
  };
  
  return (
    <div 
      className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
        isSelected ? 'bg-gray-50' : ''
      } ${isImportant ? 'bg-amber-50 hover:bg-amber-100' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={conversation.with.avatar} />
            <AvatarFallback className={
              conversation.with.role === 'admin' ? 'bg-blue-500 text-white' : ''
            }>
              {conversation.with.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="absolute bottom-0 right-0">
            <OnlineStatusIndicator isOnline={isOnline} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="font-medium truncate flex items-center">
              {conversation.with.name}
              {conversation.with.role === 'admin' && (
                <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">Admin</Badge>
              )}
            </h3>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-amber-500"
                onClick={handleStarClick}
              >
                {isImportant ? (
                  <Star className="h-4 w-4 fill-amber-500" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </Button>
              <span className="text-xs text-gray-500">
                {conversation.lastMessage.timestamp.toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <p className={`text-sm truncate ${
              !conversation.lastMessage.read && conversation.lastMessage.sender !== 'admin' 
                ? 'font-medium' 
                : 'text-gray-500'
            }`}>
              {conversation.lastMessage.sender === 'admin' ? 'Vous: ' : ''}
              {conversation.lastMessage.content}
            </p>
            {unreadCount > 0 && (
              <Badge variant="default" className="rounded-full h-5 w-5 flex items-center justify-center ml-2 p-0">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
