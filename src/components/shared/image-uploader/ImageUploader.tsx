
import React, { useState, useRef } from 'react';
import { toast } from "sonner";
import { AvatarUploader } from './AvatarUploader';
import { ButtonUploader } from './ButtonUploader';
import { CardUploader } from './CardUploader';
import { FeaturedUploader } from './FeaturedUploader';
import { cleanupImageUrls } from '@/utils/imageUtils';

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

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

    // Cleanup previous preview URL if it exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
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

  // Render different variants through component composition
  const renderVariant = () => {
    const commonProps = {
      previewUrl,
      handleFileSelect,
      handleRemove,
      isUploading,
      label,
      onImageRemove,
    };

    switch (variant) {
      case 'avatar':
        return (
          <AvatarUploader
            {...commonProps}
            className={className}
            previewClassName={previewClassName || 'h-24 w-24'}
          />
        );
      
      case 'featured':
        return (
          <FeaturedUploader
            {...commonProps}
            className={className}
            previewClassName={previewClassName || 'h-48'}
            buttonVariant={buttonVariant}
          />
        );
      
      case 'card':
        return (
          <CardUploader
            {...commonProps}
            className={className}
            previewClassName={previewClassName || 'h-32'}
          />
        );
      
      // Default button variant
      default:
        return (
          <ButtonUploader
            {...commonProps}
            className={className}
            buttonVariant={buttonVariant}
            buttonSize={buttonSize}
          />
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
