
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Image, Mic } from 'lucide-react';

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
    <div className="media-preview-container mr-2 min-w-[80px]">
      <div className="media-preview relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {mediaType === 'image' && (
          <>
            <img 
              src={mediaPreview} 
              alt="Aperçu" 
              className="h-20 w-20 object-cover" 
              onError={(e) => {
                console.error("Erreur de chargement d'aperçu:", e);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <Image className="h-6 w-6 text-white" />
            </div>
          </>
        )}
        {mediaType === 'audio' && (
          <div className="flex items-center justify-center bg-gray-100 h-20 w-20 rounded">
            <Mic className="h-6 w-6 text-blue-500" />
          </div>
        )}
        <Button 
          variant="destructive" 
          size="icon" 
          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-gray-800 hover:bg-gray-700"
          onClick={cancelMediaPreview}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-center mt-1 text-gray-600">
        {mediaType === 'image' ? 'Image' : 'Audio'}
      </p>
    </div>
  );
};

export default MediaPreview;
