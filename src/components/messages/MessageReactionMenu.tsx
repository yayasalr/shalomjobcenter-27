
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from 'lucide-react';
import { Reaction } from '@/hooks/messages/useMessageReactions';

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🙏'];

interface MessageReactionMenuProps {
  messageId: string;
  existingReactions: Reaction[];
  onAddReaction: (messageId: string, emoji: string) => void;
}

const MessageReactionMenu: React.FC<MessageReactionMenuProps> = ({
  messageId,
  existingReactions,
  onAddReaction
}) => {
  const [open, setOpen] = useState(false);
  
  const handleAddReaction = (emoji: string) => {
    onAddReaction(messageId, emoji);
    setOpen(false);
  };
  
  return (
    <div className="inline-flex items-center">
      {/* Reactions existantes */}
      <div className="flex mr-2 space-x-1">
        {Object.entries(
          existingReactions.reduce<Record<string, number>>((acc, reaction) => {
            acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
            return acc;
          }, {})
        ).map(([emoji, count]) => (
          <Button 
            key={emoji}
            variant="ghost" 
            size="sm" 
            className="h-6 px-1 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => handleAddReaction(emoji)}
          >
            <span>{emoji}</span>
            {count > 1 && <span className="ml-1 text-xs">{count}</span>}
          </Button>
        ))}
      </div>
      
      {/* Menu des réactions */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Smile className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Ajouter une réaction</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <div className="grid grid-cols-4 gap-2">
            {COMMON_EMOJIS.map(emoji => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleAddReaction(emoji)}
              >
                <span className="text-lg">{emoji}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MessageReactionMenu;
