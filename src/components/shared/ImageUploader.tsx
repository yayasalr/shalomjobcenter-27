
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X, Upload, Camera } from "lucide-react";
import { toast } from "sonner";

export interface ImageUploaderProps {
  currentImage?: string;
  onImageUpload: (file: File) => void;
  onImageRemove?: () => void;
  isUploading?: boolean;
  variant?: 'button' | 'avatar' | 'card' | 'featured';
  label?: string;
  className?: string;
  previewClassName?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'primary' | 'accent';
  buttonSize?: 'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'wide';
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageUpload,
  onImageRemove,
  isUploading = false,
  variant = 'button',
  label = 'Ajouter une image',
  className = '',
  previewClassName = '',
  buttonVariant = 'outline',
  buttonSize = 'default',
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeMB = 5
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Type de fichier non supporté. Formats acceptés: ${allowedTypes.map(type => type.replace('image/', '.')).join(', ')}`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`L'image est trop volumineuse. La taille maximale est de ${maxSizeMB} MB`);
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Call the parent component's upload handler
    onImageUpload(file);

    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(undefined);
    if (onImageRemove) {
      onImageRemove();
    }
  };

  // Render different variants of the uploader
  const renderVariant = () => {
    switch (variant) {
      case 'avatar':
        return (
          <div className={`relative ${className}`}>
            <div 
              className={`relative rounded-full overflow-hidden cursor-pointer ${previewClassName || 'h-24 w-24'}`}
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
                  <Camera className="h-8 w-8" />
                </div>
              )}
              
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
            
            {previewUrl && onImageRemove && (
              <button
                type="button"
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            <div 
              className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={handleFileSelect}
            >
              <Camera className="h-4 w-4" />
            </div>
          </div>
        );
      
      case 'featured':
        return (
          <div className={`relative mb-4 ${className}`}>
            <label className="block text-sm font-medium mb-2">{label}</label>
            {previewUrl ? (
              <div className="relative rounded-md overflow-hidden border">
                <img 
                  src={previewUrl} 
                  alt={label} 
                  className={`w-full object-cover ${previewClassName || 'h-48'}`}
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
                className={`w-full flex flex-col items-center justify-center border-dashed ${previewClassName || 'h-48'}`}
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
      
      case 'card':
        return (
          <div className={`relative ${className}`}>
            <div
              onClick={handleFileSelect}
              className={`border-2 border-dashed border-gray-300 rounded-lg overflow-hidden ${
                isUploading ? 'bg-gray-50' : 'hover:bg-gray-50'
              } transition-colors cursor-pointer ${previewClassName || 'h-32'}`}
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
      
      // Default button variant
      default:
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
    }
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
      />
      {renderVariant()}
    </>
  );
};
