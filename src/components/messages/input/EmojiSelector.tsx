
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Common emojis for the simple picker
const COMMON_EMOJIS = ['😊', '😂', '👍', '❤️', '🙏', '😍', '🎉', '👋', '🔥', '✨', '🤔', '👏', '😢', '🙄', '😎', '👀'];

interface EmojiSelectorProps {
  onEmojiSelect: (emoji: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ onEmojiSelect, open, setOpen }) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-gray-100"
          aria-label="Ajouter un emoji"
        >
          <Smile className="h-5 w-5 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-64 p-2" align="start">
        <div className="grid grid-cols-4 gap-2">
          {COMMON_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-100"
              onClick={() => onEmojiSelect(emoji)}
            >
              <span className="text-xl">{emoji}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiSelector;
