
import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { ImageUploader } from '@/components/shared/ImageUploader';

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
      // Revoke any blob URLs to free up memory
      imagePreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  // Convert the file input handler to be compatible with ImageUploader
  const handleImageUpload = useCallback((file: File) => {
    // Create a compressed FileReader operation
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        // Create an image element for compression
        const img = new Image();
        img.src = e.target.result as string;
        
        img.onload = () => {
          // Create canvas for image compression
          const canvas = document.createElement('canvas');
          
          // Determine optimal dimensions - maintain aspect ratio but limit size
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }
          
          // Resize the image
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with quality reduction
          canvas.toBlob((blob) => {
            if (blob) {
              // Create a new file from the compressed blob
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              
              // Create the mock event with the compressed file
              const mockEvent = {
                target: {
                  files: [compressedFile] as unknown as FileList
                }
              } as React.ChangeEvent<HTMLInputElement>;
              
              onImageChange(mockEvent);
            }
          }, file.type, 0.75); // 0.75 quality provides good balance
        };
      }
    };
    
    reader.readAsDataURL(file);
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
