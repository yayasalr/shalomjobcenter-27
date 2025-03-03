
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MediaPreviewProps {
  mediaPreview: string | null;
  mediaType: 'image' | 'audio' | null;
  cancelMediaPreview: () => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaPreview,
  mediaType,
  cancelMediaPreview
}) => {
  if (!mediaPreview) return null;
  
  return (
    <div className="media-preview-container">
      <div className="media-preview">
        {mediaType === 'image' && (
          <img src={mediaPreview} alt="Preview" className="h-20 object-contain" />
        )}
        {mediaType === 'audio' && (
          <div className="flex items-center justify-center bg-gray-100 h-20 w-20 rounded">
            <div className="text-gray-600">Audio</div>
          </div>
        )}
        <Button 
          variant="destructive" 
          size="icon" 
          className="absolute top-1 right-1 h-6 w-6 rounded-full"
          onClick={cancelMediaPreview}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MediaPreview;
