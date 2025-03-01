
import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { ImageUploader } from '@/components/shared/image-uploader';
import { compressImage, cleanupImageUrls } from '@/utils/imageUtils';

interface ImageUploadSectionProps {
  imagePreviews: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  imagePreviews,
  onImageChange,
  removeImage
}) => {
  // Clean up blob URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      cleanupImageUrls(imagePreviews);
    };
  }, [imagePreviews]);

  // Convert the file input handler to be compatible with ImageUploader
  const handleImageUpload = useCallback((file: File) => {
    // Use the utility function for image compression
    compressImage(file, 1200, 1200, 0.75)
      .then(compressedFile => {
        // Create the mock event with the compressed file
        const mockEvent = {
          target: {
            files: [compressedFile] as unknown as FileList
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onImageChange(mockEvent);
      })
      .catch(error => {
        console.error('Error compressing image:', error);
      });
  }, [onImageChange]);

  // Memoize the removal function to prevent recreating on every render
  const handleRemoveImage = useCallback((index: number) => {
    // If it's a blob URL, revoke it before removal
    const preview = imagePreviews[index];
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    removeImage(index);
  }, [imagePreviews, removeImage]);

  return (
    <div className="space-y-2">
      <Label htmlFor="images" className="text-gray-700 font-medium">Images</Label>
      
      <ImageUploader
        onImageUpload={handleImageUpload}
        variant="button"
        label="Sélectionner des images"
        buttonVariant="primary"
        allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
        maxSizeMB={10}
      />
      
      <p className="text-xs text-gray-500">
        Vous pouvez sélectionner plusieurs images. La première image sera utilisée comme aperçu.
      </p>

      {/* Prévisualisation des images */}
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="h-24 w-full object-cover rounded-md border shadow-sm"
                loading="lazy" // Lazy load images for better performance
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md"
                onClick={() => handleRemoveImage(index)}
                aria-label={`Supprimer l'image ${index + 1}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
