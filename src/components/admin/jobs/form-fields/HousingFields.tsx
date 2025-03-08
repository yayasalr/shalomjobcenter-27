
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X, Trash2 } from 'lucide-react';

interface HousingFieldsProps {
  bedrooms: number;
  setBedrooms: (value: number) => void;
  bathrooms: number;
  setBathrooms: (value: number) => void;
  images: string[];
  onAddImage?: () => void;
  onRemoveImage?: (index: number) => void;
  onClearAllImages?: () => void;
  isUploading?: boolean;
}

export const HousingFields: React.FC<HousingFieldsProps> = ({
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  images,
  onAddImage,
  onRemoveImage,
  onClearAllImages,
  isUploading = false
}) => {
  // Filtrer les images valides (non-blob)
  const validImages = images.filter(img => 
    !img.startsWith('blob:') && 
    (img.startsWith('http') || img.startsWith('data:image/'))
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bedrooms" className="block text-sm font-medium mb-1">
            Nombre de chambres
          </Label>
          <Input
            id="bedrooms"
            type="number"
            value={bedrooms}
            onChange={(e) => setBedrooms(Number(e.target.value))}
            min="0"
            step="1"
          />
        </div>
        <div>
          <Label htmlFor="bathrooms" className="block text-sm font-medium mb-1">
            Nombre de salles de bain
          </Label>
          <Input
            id="bathrooms"
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(Number(e.target.value))}
            min="0"
            step="0.5"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="block text-sm font-medium">
            Images du logement
          </Label>
          
          {validImages.length > 0 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onClearAllImages}
              className="flex items-center gap-1 text-xs"
            >
              <Trash2 size={14} />
              Supprimer tout
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validImages.map((image, index) => (
            <div key={index} className="relative border rounded-md overflow-hidden group">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  console.error("Erreur de chargement d'image:", image);
                  e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveImage && onRemoveImage(index)}
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
        
        {validImages.length === 0 && (
          <div className="p-4 border border-dashed rounded-md bg-gray-50 text-center text-gray-500 mb-2">
            <p>Aucune image ajoutée</p>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-1">
          La première image sera utilisée comme image principale.
        </p>
      </div>
    </div>
  );
};
