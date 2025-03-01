
import React from 'react';
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ImageManagementSectionProps {
  images: string[];
  featuredImage: string;
  isUploading: boolean;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onFeaturedImageUpload: () => void;
  setFeaturedImage: (url: string) => void;
}

export const ImageManagementSection: React.FC<ImageManagementSectionProps> = ({
  images,
  featuredImage,
  isUploading,
  onAddImage,
  onRemoveImage,
  onFeaturedImageUpload,
  setFeaturedImage
}) => {
  return (
    <div className="space-y-6">
      {/* Section d'image principale */}
      <div className="mb-6">
        <Label className="block text-sm font-medium mb-2">Image principale</Label>
        {featuredImage ? (
          <div className="relative rounded-md overflow-hidden border">
            <img 
              src={featuredImage} 
              alt="Image principale" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8 rounded-full" 
                onClick={() => setFeaturedImage('')}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full" 
                onClick={onFeaturedImageUpload}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-48 flex flex-col items-center justify-center border-dashed"
            onClick={onFeaturedImageUpload}
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
                <span>Ajouter une image principale</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Section d'images supplémentaires */}
      <div>
        <Label className="block text-sm font-medium mb-2">Images supplémentaires</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative border rounded-md overflow-hidden">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => onRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="h-32 border-dashed flex flex-col items-center justify-center"
            onClick={onAddImage}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin mb-1" />
                <span className="text-xs">Téléchargement...</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-6 w-6 mb-1" />
                <span className="text-xs">Ajouter une image</span>
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Ajoutez des images pour illustrer cette offre. La première sera utilisée comme aperçu.
        </p>
      </div>
    </div>
  );
};
