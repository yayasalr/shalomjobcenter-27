
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  imageUrl: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  imageUrl,
  onUpload,
  isUploading
}) => {
  const [localImageUrl, setLocalImageUrl] = useState(imageUrl);
  
  // Mettre à jour l'URL locale lorsque l'URL d'image change
  React.useEffect(() => {
    setLocalImageUrl(imageUrl);
    console.log("Image URL mise à jour dans ImageUploadField");
  }, [imageUrl]);
  
  return (
    <div className="flex-1">
      {label && <Label className="mb-2">{label}</Label>}
      <Button 
        variant="outline" 
        className="w-full justify-start h-auto py-2 relative"
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span>Chargement...</span>
          </div>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            <span>Choisir une image</span>
          </>
        )}
        <input
          type="file"
          onChange={onUpload}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
      </Button>
    </div>
  );
};
