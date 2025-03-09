
import React from 'react';
import { Message } from './types';
import { MoreHorizontal, Star, StarOff, Share, Bookmark } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MessageReactionMenu from './MessageReactionMenu';
import { Reaction } from '@/hooks/messages/useMessageReactions';

interface EnhancedMessageBubbleProps {
  message: Message;
  isUser: boolean;
  conversationId: string;
  conversationName: string;
  messageReactions: Reaction[];
  onAddReaction: (messageId: string, emoji: string) => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  onShare: () => void;
  onForward: () => void;
}

const EnhancedMessageBubble: React.FC<EnhancedMessageBubbleProps> = ({
  message,
  isUser,
  conversationId,
  conversationName,
  messageReactions,
  onAddReaction,
  onToggleFavorite,
  isFavorite,
  onShare,
  onForward
}) => {
  const formattedDate = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const bubbleClass = isUser 
    ? "message-bubble message-bubble-user"
    : "message-bubble message-bubble-other";
  
  return (
    <div className={`group relative mb-4 ${isUser ? 'ml-auto' : 'mr-auto'}`}>
      <div className={bubbleClass}>
        <div className="message-content">{message.content}</div>
        <div className="message-time flex items-center justify-end text-xs text-gray-500">
          {formattedDate}
          {message.sender === 'user' && (
            <span className="ml-1">
              {message.read ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="whatsapp-read-tick">✓✓</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Lu</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="whatsapp-single-tick">✓</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Envoyé</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </span>
          )}
        </div>
      </div>
      
      {/* Menu de réactions */}
      <div className={`absolute bottom-0 ${isUser ? 'left-0 -translate-x-full -ml-2' : 'right-0 translate-x-full mr-2'}`}>
        <MessageReactionMenu 
          messageId={message.id} 
          existingReactions={messageReactions}
          onAddReaction={onAddReaction} 
        />
      </div>
      
      {/* Menu d'actions sur le message */}
      <div className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'left-0 -translate-x-full -ml-2' : 'right-0 translate-x-full mr-2'}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-full hover:bg-gray-200">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isUser ? "start" : "end"}>
            <DropdownMenuItem onClick={onToggleFavorite}>
              {isFavorite ? (
                <>
                  <StarOff className="mr-2 h-4 w-4" />
                  <span>Retirer des favoris</span>
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  <span>Ajouter aux favoris</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
              <Share className="mr-2 h-4 w-4" />
              <span>Partager</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onForward}>
              <Bookmark className="mr-2 h-4 w-4" />
              <span>Transférer</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(message.content)}>
              Copier le texte
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EnhancedMessageBubble;
