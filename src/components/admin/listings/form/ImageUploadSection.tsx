
import React from 'react';
import { Upload, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="space-y-2">
      <Label htmlFor="images" className="text-gray-700 font-medium">Images</Label>
      <div className="flex items-center gap-2">
        <label 
          htmlFor="images" 
          className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors shadow-md"
        >
          <Upload size={18} />
          Sélectionner des images
        </label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={onImageChange}
          className="hidden"
        />
      </div>
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
