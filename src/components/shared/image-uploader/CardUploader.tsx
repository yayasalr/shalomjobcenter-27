
import React from 'react';
import { ImagePlus, Loader2, X } from "lucide-react";

interface CardUploaderProps {
  previewUrl?: string;
  handleFileSelect: () => void;
  handleRemove: () => void;
  isUploading: boolean;
  label: string;
  className?: string;
  previewClassName?: string;
  onImageRemove?: () => void;
}

export const CardUploader: React.FC<CardUploaderProps> = ({
  previewUrl,
  handleFileSelect,
  handleRemove,
  isUploading,
  label,
  className = '',
  previewClassName = 'h-32',
  onImageRemove
}) => {
  return (
    <div className={`relative ${className}`}>
      <div
        onClick={handleFileSelect}
        className={`border-2 border-dashed border-gray-300 rounded-lg overflow-hidden ${
          isUploading ? 'bg-gray-50' : 'hover:bg-gray-50'
        } transition-colors cursor-pointer ${previewClassName} aspect-[16/9]`}
      >
        {previewUrl ? (
          <div className="relative h-full">
            <img
              src={previewUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            {onImageRemove && (
              <button
                type="button"
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin mb-2 text-gray-400" />
                <span className="text-sm text-gray-500">Téléchargement...</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-10 w-10 mb-2 text-gray-400" />
                <span className="text-sm text-gray-500">{label}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
