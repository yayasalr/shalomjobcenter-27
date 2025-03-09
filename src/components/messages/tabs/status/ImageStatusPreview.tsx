
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ImageStatusPreviewProps {
  imageUrl: string;
  onPublish: () => void;
  onCancel: () => void;
}

const ImageStatusPreview: React.FC<ImageStatusPreviewProps> = ({ 
  imageUrl, 
  onPublish, 
  onCancel 
}) => {
  const [caption, setCaption] = useState('');

  return (
    <div className="mt-3 flex flex-col space-y-3">
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="w-full object-contain max-h-64"
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Add a caption (optional)..."
        className="min-h-[80px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      
      <div className="flex space-x-2">
        <Button 
          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          onClick={onPublish}
        >
          <Send className="h-4 w-4 mr-1" />
          Publish
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ImageStatusPreview;
