
import React, { useEffect } from 'react';
import { X, Trash2, AlertCircle, Upload } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Vérifier l'état des images au chargement
  useEffect(() => {
    if (imagePreviews && imagePreviews.length > 0) {
      console.log(`${imagePreviews.length} images disponibles au chargement:`, imagePreviews);
    } else {
      console.log("Aucune image n'est disponible au chargement");
    }
  }, []);

  // Gérer les erreurs d'affichage d'images
  const handleImageError = (index: number, url: string) => {
    console.error(`Erreur de chargement pour l'image à l'index ${index}:`, url);
    toast.error(`Erreur de chargement d'image`);
  };

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
      
      <div className={`border border-dashed rounded-md p-4 ${error ? 'border-red-500' : 'border-gray-300'}`}>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onImageChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
        />
        
        <Button 
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="w-full py-8 flex flex-col items-center justify-center gap-2"
        >
          <Upload size={24} className="text-gray-500" />
          <span className="font-medium">Sélectionner des images</span>
          <span className="text-xs text-gray-500">
            Formats acceptés: JPG, PNG, GIF, WEBP (max 10MB)
          </span>
        </Button>
      </div>
      
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
            <div key={`${preview}-${index}`} className="relative group">
              <img
                src={preview}
                alt={`Aperçu ${index + 1}`}
                className="h-24 w-full object-cover rounded-md border shadow-sm"
                loading="lazy"
                onError={() => handleImageError(index, preview)}
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
