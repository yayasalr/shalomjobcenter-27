
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
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
    <div>
      <Label>{label}</Label>
      <div className="flex items-center space-x-4 mt-1">
        <img src={imageUrl} alt={label} className="h-8 w-auto" />
        <ImageUploader
          currentImage={imageUrl}
          onImageUpload={() => onUpload()}
          isUploading={isUploading}
          variant="button"
          label={`Modifier le ${label.toLowerCase()}`}
          buttonVariant="secondary"
          buttonSize="sm"
          className="flex-1"
        />
      </div>
    </div>
  );
};
