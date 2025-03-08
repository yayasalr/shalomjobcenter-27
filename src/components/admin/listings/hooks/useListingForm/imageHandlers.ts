
import { useState, useEffect } from "react";
import { Listing } from "@/types/listing";

export const useImageHandlers = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...filesArray]);
      
      // Créer des URL pour les prévisualisations
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      console.log("NOUVELLES IMAGES TÉLÉCHARGÉES:", newPreviews);
      
      // IMPORTANT: AJOUTER les nouvelles prévisualisations aux existantes, pas les remplacer
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
      
      // Stockage permanent et fiable
      try {
        const timestamp = Date.now();
        const key = `new_listing_images_${timestamp}`;
        
        // Récupérer les prévisualisations existantes
        const existingPreviewsStr = localStorage.getItem('latest_listing_images') || '[]';
        const existingPreviews = JSON.parse(existingPreviewsStr);
        
        // Combiner avec les nouvelles
        const allPreviews = [...existingPreviews, ...newPreviews];
        
        // Stocker dans localStorage ET sessionStorage pour une persistance maximale
        localStorage.setItem(key, JSON.stringify(allPreviews));
        sessionStorage.setItem(key, JSON.stringify(allPreviews));
        
        // Marquer cette entrée comme la plus récente
        localStorage.setItem('latest_listing_images_timestamp', timestamp.toString());
        sessionStorage.setItem('latest_listing_images_timestamp', timestamp.toString());
        
        // Clé de secours avec les images combinées
        localStorage.setItem('latest_listing_images', JSON.stringify(allPreviews));
        sessionStorage.setItem('latest_listing_images', JSON.stringify(allPreviews));
        
        console.log(`Images totales stockées: ${allPreviews.length}`, allPreviews);
      } catch (error) {
        console.error('Erreur lors du stockage des prévisualisations:', error);
      }
    }
  };

  const removeImage = (index: number) => {
    // Supprimer le fichier
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // Révoquer l'URL de l'objet Blob
    if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    
    // Mettre à jour les prévisualisations
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Mettre à jour les stockages
    try {
      const timestamp = Date.now();
      const key = `new_listing_images_${timestamp}`;
      
      localStorage.setItem(key, JSON.stringify(updatedPreviews));
      sessionStorage.setItem(key, JSON.stringify(updatedPreviews));
      localStorage.setItem('latest_listing_images_timestamp', timestamp.toString());
      sessionStorage.setItem('latest_listing_images_timestamp', timestamp.toString());
      localStorage.setItem('latest_listing_images', JSON.stringify(updatedPreviews));
      sessionStorage.setItem('latest_listing_images', JSON.stringify(updatedPreviews));
      
      console.log("Images mises à jour après suppression:", updatedPreviews);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des prévisualisations:', error);
    }
    
    setImagePreviews(updatedPreviews);
  };

  const resetImages = () => {
    // Nettoyer les URL blob pour éviter les fuites mémoire
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    setImages([]);
    setImagePreviews([]);
    
    // Nettoyer également le localStorage
    localStorage.removeItem('latest_listing_images');
    sessionStorage.removeItem('latest_listing_images');
  };

  // Nettoyer les URL blob lors du démontage du composant
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
