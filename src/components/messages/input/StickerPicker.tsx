
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Sticker } from 'lucide-react';

interface StickerPickerProps {
  showStickerPicker: boolean;
  setShowStickerPicker: (show: boolean) => void;
  onStickerClick: (stickerUrl: string) => void;
}

const StickerPicker: React.FC<StickerPickerProps> = ({
  showStickerPicker,
  setShowStickerPicker,
  onStickerClick
}) => {
  // Mock stickers for the demo
  const stickers = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
  ];

  return (
    <Dialog open={showStickerPicker} onOpenChange={setShowStickerPicker}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 hover:bg-gray-200 rounded-full touch-manipulation"
          onClick={() => setShowStickerPicker(true)}
        >
          <Sticker className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-2 w-64">
        <div className="grid grid-cols-2 gap-2">
          {stickers.map((sticker, index) => (
            <div 
              key={index} 
              className="h-24 w-full border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => onStickerClick(sticker)}
            >
              <img src={sticker} alt="Sticker" className="h-full w-full object-contain" />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StickerPicker;
