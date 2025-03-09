
import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageReactionMenu from './MessageReactionMenu';
import { MoreVertical, Star, StarOff, Share, Forward } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Reaction } from '@/hooks/messages/useMessageReactions';

export interface EnhancedMessageBubbleProps {
  message: any;
  isUser: boolean;
  conversationId: string;
  conversationName: string;
  messageReactions: Reaction[];
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
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
  onRemoveReaction,
  onToggleFavorite,
  isFavorite,
  onShare,
  onForward
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-2">
        <MessageBubble 
          message={message} 
          isUser={isUser} 
        />
        
        {showActions && (
          <div className="absolute right-0 top-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                  <span className="sr-only">Actions</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-0" align="end">
                <div className="p-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start"
                    onClick={onToggleFavorite}
                  >
                    {isFavorite ? 
                      <><StarOff className="mr-2 h-4 w-4 text-yellow-500" /> Enlever favori</> : 
                      <><Star className="mr-2 h-4 w-4" /> Ajouter favori</>
                    }
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start"
                    onClick={onShare}
                  >
                    <Share className="mr-2 h-4 w-4" /> Partager
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start"
                    onClick={onForward}
                  >
                    <Forward className="mr-2 h-4 w-4" /> Transférer
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      
      {/* Reactions section below the message */}
      <div className="ml-2 mt-1">
        <MessageReactionMenu 
          messageId={message.id}
          existingReactions={messageReactions}
          onAddReaction={onAddReaction}
          onRemoveReaction={onRemoveReaction}
        />
      </div>
    </div>
  );
};

export default EnhancedMessageBubble;
