
import React from 'react';
import { Camera, Loader2, X } from "lucide-react";

interface AvatarUploaderProps {
  previewUrl?: string;
  handleFileSelect: () => void;
  handleRemove: () => void;
  isUploading: boolean;
  label: string;
  className?: string;
  previewClassName?: string;
  onImageRemove?: () => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  previewUrl,
  handleFileSelect,
  handleRemove,
  isUploading,
  label,
  className = '',
  previewClassName = 'h-36 w-36', // Taille augmentée pour une meilleure visibilité
  onImageRemove
}) => {
  return (
    <div className={`relative ${className}`}>
      <div 
        className={`relative rounded-full overflow-hidden cursor-pointer border-2 border-primary/30 shadow-md ${previewClassName}`}
        onClick={handleFileSelect}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={label} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
            <Camera className="h-14 w-14" /> {/* Icône plus grande */}
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Loader2 className="h-14 w-14 animate-spin text-white" /> {/* Loader plus grand */}
          </div>
        )}
      </div>
      
      {previewUrl && onImageRemove && (
        <button
          type="button"
          className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full shadow-md"
          onClick={handleRemove}
        >
          <X className="h-5 w-5" />
        </button>
      )}
      
      <div 
        className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-md"
        onClick={handleFileSelect}
      >
        <Camera className="h-6 w-6" />
      </div>
    </div>
  );
};
