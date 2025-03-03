
import React from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, Image } from 'lucide-react';

interface MediaAttachmentButtonsProps {
  handleFileSelect: () => void;
}

const MediaAttachmentButtons: React.FC<MediaAttachmentButtonsProps> = ({ handleFileSelect }) => {
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-500 hover:bg-gray-200 rounded-full touch-manipulation"
        onClick={handleFileSelect}
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-500 hover:bg-gray-200 rounded-full touch-manipulation"
        onClick={handleFileSelect}
      >
        <Image className="h-5 w-5" />
      </Button>
    </>
  );
};

export default MediaAttachmentButtons;
