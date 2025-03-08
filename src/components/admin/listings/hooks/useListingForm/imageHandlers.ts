
import { useState, useEffect } from "react";
import { Listing } from "@/types/listing";

export const useImageHandlers = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      console.log("NOUVELLES IMAGES TÉLÉCHARGÉES:", newPreviews);
      
      // Stockage avec horodatage pour garantir que ce sont toujours les plus récentes
      try {
        // Effacer les anciennes prévisualisations pour s'assurer que seules les nouvelles sont utilisées
        sessionStorage.removeItem('listing_image_previews');
        localStorage.removeItem('listing_image_previews');
        
        // Stockage avec horodatage précis pour éviter toute confusion
        const timestamp = Date.now();
        const key = `listing_image_previews_${timestamp}`;
        
        // Stocker les nouvelles prévisualisations
        sessionStorage.setItem(key, JSON.stringify(newPreviews));
        localStorage.setItem(key, JSON.stringify(newPreviews));
        
        // Stocker également le dernier timestamp utilisé
        localStorage.setItem('latest_image_previews_timestamp', timestamp.toString());
        
        console.log(`Nouvelles images stockées avec timestamp ${timestamp}`, newPreviews);
      } catch (error) {
        console.error('Erreur lors du stockage des prévisualisations:', error);
      }
      
      // REMPLACER complètement les prévisualisations précédentes
      setImagePreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // Révoquer l'URL de l'objet Blob pour éviter les fuites de mémoire
    if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    
    // Mise à jour du stockage
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    try {
      const timestamp = Date.now();
      const key = `listing_image_previews_${timestamp}`;
      
      // Stocker les prévisualisations mises à jour
      sessionStorage.setItem(key, JSON.stringify(updatedPreviews));
      localStorage.setItem(key, JSON.stringify(updatedPreviews));
      localStorage.setItem('latest_image_previews_timestamp', timestamp.toString());
      
      console.log("Images mises à jour après suppression:", updatedPreviews);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des prévisualisations stockées:', error);
    }
    
    setImagePreviews(updatedPreviews);
  };

  const resetImages = () => {
    // Nettoyer les objets URL pour éviter les fuites de mémoire
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    // Effacer le stockage pour garantir un nouvel état propre
    try {
      sessionStorage.removeItem('listing_image_previews');
      localStorage.removeItem('listing_image_previews');
      
      // Trouver et supprimer tous les stockages d'images datés
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('listing_image_previews_')) {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        }
      }
      
      localStorage.removeItem('latest_image_previews_timestamp');
      console.log("Nettoyage complet du stockage d'images");
    } catch (error) {
      console.error('Erreur lors du nettoyage du stockage:', error);
    }
    
    setImages([]);
    setImagePreviews([]);
  };

  // Ne pas charger les anciennes images au montage du composant
  // Cela garantit que chaque formulaire commence propre
  useEffect(() => {
    return () => {
      // Nettoyage des URL blob lors du démontage
      imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  return {
    images,
    imagePreviews,
    handleImageChange,
    removeImage,
    resetImages
  };
};
