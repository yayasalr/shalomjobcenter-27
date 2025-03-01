
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image, Upload } from "lucide-react";
import { ImageUploader } from '@/components/shared/ImageUploader';

interface ImageUploadFieldProps {
  label: string;
  imageUrl: string;
  onUpload: () => void;
  isUploading: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  imageUrl,
  onUpload,
  isUploading
}) => {
  return (
    <div className="flex-1">
      {label && <Label className="mb-2">{label}</Label>}
      <Button 
        onClick={onUpload} 
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
            <Image className="h-4 w-4 mr-2" />
            <span>Modifier l'image</span>
          </>
        )}
      </Button>
    </div>
  );
};
