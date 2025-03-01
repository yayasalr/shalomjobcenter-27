
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

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
        <Button variant="secondary" size="sm" onClick={onUpload} disabled={isUploading}>
          {isUploading ? 'Téléchargement...' : `Modifier le ${label.toLowerCase()}`}
          <Upload className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
