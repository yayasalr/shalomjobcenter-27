
import React from 'react';
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";

interface ButtonUploaderProps {
  previewUrl?: string;
  handleFileSelect: () => void;
  handleRemove: () => void;
  isUploading: boolean;
  label: string;
  className?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'primary' | 'accent';
  buttonSize?: 'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'wide';
  onImageRemove?: () => void;
}

export const ButtonUploader: React.FC<ButtonUploaderProps> = ({
  previewUrl,
  handleFileSelect,
  handleRemove,
  isUploading,
  label,
  className = '',
  buttonVariant = 'outline',
  buttonSize = 'default',
  onImageRemove
}) => {
  return (
    <div className={className}>
      {label && <span className="block text-sm font-medium mb-2">{label}</span>}
      <div className="flex items-center space-x-4">
        {previewUrl && (
          <div className="relative h-12 w-12 rounded overflow-hidden">
            <img
              src={previewUrl}
              alt={label}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <Button
          type="button"
          variant={buttonVariant}
          size={buttonSize}
          onClick={handleFileSelect}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Téléchargement...</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4" />
              <span>{previewUrl ? 'Changer l\'image' : label}</span>
            </>
          )}
        </Button>
        {previewUrl && onImageRemove && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
