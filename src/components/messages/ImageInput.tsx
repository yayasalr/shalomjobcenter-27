
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Image, X } from 'lucide-react';

interface ImageInputProps {
  onImageSelect: (file: File) => void;
  selectedImage: string | null;
  onClearImage: () => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ 
  onImageSelect, 
  selectedImage, 
  onClearImage 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      // Reset input value so the same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {selectedImage ? (
        <div className="relative inline-block">
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="h-24 w-auto rounded-md object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={onClearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-100"
          onClick={handleClick}
        >
          <Image className="h-5 w-5 text-gray-500" />
        </Button>
      )}
    </div>
  );
};

export default ImageInput;
