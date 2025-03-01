
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image, Upload } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  imageUrl: string;
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  imageUrl,
  onUpload,
  isUploading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    onUpload(file);
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="flex-1">
      {label && <Label className="mb-2">{label}</Label>}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <Button 
        onClick={handleButtonClick} 
        variant="outline" 
        className="w-full justify-start h-auto py-2"
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2"></div>
            <span>Chargement...</span>
          </div>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            <span>Choisir une image</span>
          </>
        )}
      </Button>
    </div>
  );
};
