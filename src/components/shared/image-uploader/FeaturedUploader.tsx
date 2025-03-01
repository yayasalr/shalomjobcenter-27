
import React from 'react';
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";

interface FeaturedUploaderProps {
  previewUrl?: string;
  handleFileSelect: () => void;
  handleRemove: () => void;
  isUploading: boolean;
  label: string;
  className?: string;
  previewClassName?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'primary' | 'accent';
  onImageRemove?: () => void;
}

export const FeaturedUploader: React.FC<FeaturedUploaderProps> = ({
  previewUrl,
  handleFileSelect,
  handleRemove,
  isUploading,
  label,
  className = '',
  previewClassName = 'h-48',
  buttonVariant = 'outline',
  onImageRemove
}) => {
  return (
    <div className={`relative mb-4 ${className}`}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {previewUrl ? (
        <div className="relative rounded-md overflow-hidden border">
          <img 
            src={previewUrl} 
            alt={label} 
            className={`w-full object-cover ${previewClassName}`}
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            {onImageRemove && (
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8 rounded-full shadow-md" 
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button 
              type="button" 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 rounded-full shadow-md" 
              onClick={handleFileSelect}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          type="button" 
          variant={buttonVariant} 
          className={`w-full flex flex-col items-center justify-center border-dashed ${previewClassName}`}
          onClick={handleFileSelect}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <span>Téléchargement en cours...</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 mb-2" />
              <span>{label}</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};
