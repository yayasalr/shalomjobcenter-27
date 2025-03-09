
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
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full hover:bg-gray-100"
        onClick={handleClick}
        aria-label="Ajouter une image"
      >
        <Image className="h-5 w-5 text-gray-500" />
      </Button>
    </div>
  );
};

export default ImageInput;
