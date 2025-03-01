
import React from 'react';
import { X } from 'lucide-react';
import { Input } from "@/components/ui/input";
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
  // Convert the file input handler to be compatible with ImageUploader
  const handleImageUpload = (file: File) => {
    const mockEvent = {
      target: {
        files: [file] as unknown as FileList
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onImageChange(mockEvent);
  };

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
        <div className="grid grid-cols-3 gap-2 mt-2">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="h-24 w-full object-cover rounded-md border shadow-sm"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md"
                onClick={() => removeImage(index)}
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
