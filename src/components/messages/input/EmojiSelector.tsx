
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AdvancedEmojiPicker from './AdvancedEmojiPicker';

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
      <PopoverContent side="top" className="w-80 p-0" align="start">
        <AdvancedEmojiPicker 
          onEmojiSelect={onEmojiSelect} 
          onClose={() => setOpen(false)} 
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiSelector;
