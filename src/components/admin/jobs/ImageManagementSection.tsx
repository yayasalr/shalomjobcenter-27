
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, Trash2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { ImageUploader } from '@/components/shared/ImageUploader';

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
  // Fonction pour supprimer toutes les images
  const clearAllImages = () => {
    // Supprimer l'image principale
    setFeaturedImage('');
    
    // Supprimer toutes les images additionnelles en partant de la fin
    if (images.length > 0) {
      const totalImages = images.length;
      for (let i = totalImages - 1; i >= 0; i--) {
        onRemoveImage(i);
      }
    }
    
    // Nettoyer le localStorage
    localStorage.removeItem('job_images_latest');
    localStorage.removeItem('job_featured_image_latest');
    localStorage.removeItem('job_images_latest_timestamp');
    localStorage.removeItem('job_featured_image_latest_timestamp');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Gestion des images</h3>
        {(featuredImage || images.length > 0) && (
          <Button 
            type="button" 
            variant="destructive" 
            size="sm"
            onClick={clearAllImages}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            Supprimer toutes les images
          </Button>
        )}
      </div>

      {/* Section d'image principale */}
      <div className="mb-6">
        <Label className="block text-sm font-medium mb-2">Image principale</Label>
        <div className="border rounded-md overflow-hidden bg-gray-50 relative">
          {featuredImage ? (
            <div className="relative">
              <img 
                src={featuredImage} 
                alt="Image principale" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.error("Erreur de chargement d'image principale:", featuredImage);
                  e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
                }}
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/80 hover:bg-white"
                  onClick={onFeaturedImageUpload}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 bg-white/80 hover:bg-destructive"
                  onClick={() => setFeaturedImage('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full h-48 border-dashed flex flex-col items-center justify-center"
              onClick={onFeaturedImageUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                  <span>Téléchargement...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Ajouter une image principale</span>
                  <span className="text-xs text-gray-500 mt-1">Cliquez pour télécharger</span>
                </div>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Section d'images supplémentaires */}
      <div>
        <Label className="block text-sm font-medium mb-2">Images supplémentaires</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative border rounded-md overflow-hidden group">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  console.error("Erreur de chargement d'image supplémentaire:", image);
                  e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-1"></div>
                <span className="text-xs">Téléchargement...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-xs">Ajouter une image</span>
              </div>
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
