
import { useState } from 'react';
import { toast } from 'sonner';

export const useUploadImage = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    
    try {
      const files = Array.from(e.target.files);
      
      // Check file sizes (max 5MB per file)
      const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error("Certaines images dépassent la taille maximale de 5MB");
        setUploading(false);
        return;
      }
      
      // Process valid files
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      if (validFiles.length === 0) {
        toast.error("Veuillez sélectionner des fichiers image valides");
        setUploading(false);
        return;
      }
      
      // Load previews
      const newPreviews: string[] = [];
      let loadedCount = 0;
      
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          loadedCount++;
          
          if (loadedCount === validFiles.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
            setUploading(false);
            toast.success(`${validFiles.length} image(s) chargée(s) avec succès`);
          }
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("Erreur lors du chargement des images:", error);
      toast.error("Erreur lors du chargement des images");
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setImagePreviews([]);
  };

  return {
    imagePreviews,
    uploading,
    handleImageChange,
    removeImage,
    clearImages
  };
};
