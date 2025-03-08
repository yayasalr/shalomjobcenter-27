
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
      console.log("Nouvelles URL de prévisualisation créées:", newPreviews);
      
      // Stocker les nouvelles URL dans le cache de session pour la persistance
      try {
        const storedPreviews = sessionStorage.getItem('listing_image_previews');
        const currentPreviews = storedPreviews ? JSON.parse(storedPreviews) : [];
        const updatedPreviews = [...currentPreviews, ...newPreviews];
        sessionStorage.setItem('listing_image_previews', JSON.stringify(updatedPreviews));
      } catch (error) {
        console.error('Erreur lors du stockage des prévisualisations:', error);
      }
      
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // Révoquer l'URL de l'objet Blob pour éviter les fuites de mémoire
    if (imagePreviews[index]) {
      if (imagePreviews[index].startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviews[index]);
      }
    }
    
    // Mettre à jour le stockage de session
    try {
      const storedPreviews = sessionStorage.getItem('listing_image_previews');
      if (storedPreviews) {
        const currentPreviews = JSON.parse(storedPreviews);
        currentPreviews.splice(index, 1);
        sessionStorage.setItem('listing_image_previews', JSON.stringify(currentPreviews));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des prévisualisations stockées:', error);
    }
    
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const resetImages = () => {
    // Nettoyer les objets URL pour éviter les fuites de mémoire
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    // Effacer le stockage de session
    try {
      sessionStorage.removeItem('listing_image_previews');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des prévisualisations stockées:', error);
    }
    
    setImages([]);
    setImagePreviews([]);
  };

  // Charger les prévisualisations d'images depuis le stockage de session au montage du composant
  useEffect(() => {
    try {
      const storedPreviews = sessionStorage.getItem('listing_image_previews');
      if (storedPreviews) {
        const parsedPreviews = JSON.parse(storedPreviews);
        setImagePreviews(parsedPreviews);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des prévisualisations stockées:', error);
    }
  }, []);

  // Nettoyage des URL blob lors du démontage du composant
  useEffect(() => {
    return () => {
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
