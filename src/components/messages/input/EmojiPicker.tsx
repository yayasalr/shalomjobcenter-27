
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  onEmojiClick: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick
}) => {
  // Mock emojis for the demo
  const emojis = ['😊', '😂', '❤️', '👍', '🙏', '😍', '🔥', '😢', '🎉', '🤔'];

  return (
    <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 hover:bg-gray-200 rounded-full touch-manipulation"
          onClick={() => setShowEmojiPicker(true)}
        >
          <Smile className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-2 w-64">
        <div className="grid grid-cols-5 gap-2">
          {emojis.map((emoji, index) => (
            <Button 
              key={index} 
              variant="ghost" 
              className="h-10 w-10 text-xl"
              onClick={() => onEmojiClick(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmojiPicker;
