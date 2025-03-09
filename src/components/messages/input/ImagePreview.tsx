
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  selectedImage: string;
  onClearImage: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ selectedImage, onClearImage }) => {
  if (!selectedImage) return null;
  
  return (
    <div className="px-3 py-2">
      <div className="relative inline-block">
        <img 
          src={selectedImage} 
          alt="Selected" 
          className="h-20 w-auto rounded-md object-cover"
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
          onClick={onClearImage}
        >
          <span className="sr-only">Remove image</span>
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;
