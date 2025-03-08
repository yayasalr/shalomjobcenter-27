
import React, { useEffect, useCallback } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { ImageUploader } from '@/components/shared/image-uploader';
import { useUploadImage } from '@/hooks/upload';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

interface ImageUploadSectionProps {
  imagePreviews: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  error?: string;
  clearAllImages?: () => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  imagePreviews,
  onImageChange,
  removeImage,
  error,
  clearAllImages
}) => {
  const { toast } = useToast();
  const { handleSingleImageUpload } = useUploadImage({
    maxFileSize: 10,
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  });

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const result = await handleSingleImageUpload(file);
      if (result) {
        const mockEvent = {
          target: {
            files: [result.compressedFile] as unknown as FileList
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onImageChange(mockEvent);
        
        toast({
          title: "Image téléchargée",
          description: "L'image a été ajoutée avec succès"
        });
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
      toast({
        variant: "destructive",
        title: "Erreur de téléchargement",
        description: "Une erreur s'est produite lors du traitement de l'image"
      });
    }
  }, [handleSingleImageUpload, onImageChange, toast]);

  // Si aucune image n'est visible mais que le localStorage contient des images
  useEffect(() => {
    if (imagePreviews.length === 0) {
      const savedImages = localStorage.getItem('latest_listing_images');
      if (savedImages) {
        try {
          console.log("Récupération des images depuis localStorage");
        } catch (error) {
          console.error("Erreur lors de la récupération des images:", error);
        }
      }
    }
  }, [imagePreviews.length]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label 
          htmlFor="images" 
          className={`text-gray-700 font-medium ${error ? 'text-red-500' : ''}`}
        >
          Images {imagePreviews.length === 0 && '*'}
        </Label>
        
        {imagePreviews.length > 0 && (
          <Button 
            type="button" 
            variant="destructive" 
            size="sm"
            onClick={clearAllImages}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            Supprimer tout
          </Button>
        )}
      </div>
      
      <ImageUploader
        onImageUpload={handleImageUpload}
        variant="button"
        label="Sélectionner des images"
        buttonVariant="primary"
        allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
        maxSizeMB={10}
        className={error ? 'border border-red-500 rounded-md p-1' : ''}
      />
      
      {error ? (
        <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
          <AlertCircle size={14} />
          <p>{error}</p>
        </div>
      ) : (
        <p className="text-xs text-gray-500">
          Vous pouvez sélectionner plusieurs images. La première image sera utilisée comme aperçu.
        </p>
      )}

      {imagePreviews.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Aperçu ${index + 1}`}
                className="h-24 w-full object-cover rounded-md border shadow-sm"
                loading="lazy"
                onError={(e) => {
                  console.error("Erreur de chargement d'image:", preview);
                  e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                  aria-label={`Supprimer l'image ${index + 1}`}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 border border-dashed rounded-md bg-gray-50 text-center text-gray-500">
          <p>Aucune image ajoutée</p>
        </div>
      )}
    </div>
  );
};
