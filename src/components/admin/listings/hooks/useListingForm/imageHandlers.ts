
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
      
      // Stocker les nouvelles URL dans le stockage de session ET local pour double persistance
      try {
        const storedPreviews = sessionStorage.getItem('listing_image_previews');
        const currentPreviews = storedPreviews ? JSON.parse(storedPreviews) : [];
        const updatedPreviews = [...currentPreviews, ...newPreviews];
        
        // Stocker dans sessionStorage (pour la session en cours)
        sessionStorage.setItem('listing_image_previews', JSON.stringify(updatedPreviews));
        console.log("Prévisualisations stockées dans sessionStorage:", updatedPreviews);
        
        // Stocker aussi dans localStorage pour une persistance plus longue
        localStorage.setItem('listing_image_previews', JSON.stringify(updatedPreviews));
        console.log("Prévisualisations stockées dans localStorage pour persistance:", updatedPreviews);
        
        // Stocker aussi les images individuelles pour plus de robustesse
        newPreviews.forEach((url, idx) => {
          const key = `listing_image_preview_${Date.now()}_${idx}`;
          localStorage.setItem(key, url);
          console.log(`Image individuelle stockée sous la clé ${key}`);
        });
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
        console.log(`URL révoquée: ${imagePreviews[index]}`);
      }
    }
    
    // Mettre à jour le stockage
    try {
      // Mettre à jour sessionStorage
      const storedPreviews = sessionStorage.getItem('listing_image_previews');
      if (storedPreviews) {
        const currentPreviews = JSON.parse(storedPreviews);
        currentPreviews.splice(index, 1);
        sessionStorage.setItem('listing_image_previews', JSON.stringify(currentPreviews));
        console.log("Prévisualisations mises à jour dans sessionStorage après suppression");
      }
      
      // Mettre à jour localStorage
      const localStoredPreviews = localStorage.getItem('listing_image_previews');
      if (localStoredPreviews) {
        const localCurrentPreviews = JSON.parse(localStoredPreviews);
        localCurrentPreviews.splice(index, 1);
        localStorage.setItem('listing_image_previews', JSON.stringify(localCurrentPreviews));
        console.log("Prévisualisations mises à jour dans localStorage après suppression");
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
        console.log(`URL révoquée lors de la réinitialisation: ${url}`);
      }
    });
    
    // Effacer le stockage
    try {
      sessionStorage.removeItem('listing_image_previews');
      console.log("Prévisualisations supprimées de sessionStorage");
      
      // Ne pas effacer localStorage pour conserver une référence persistante
      // localStorage.removeItem('listing_image_previews');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des prévisualisations stockées:', error);
    }
    
    setImages([]);
    setImagePreviews([]);
  };

  // Charger les prévisualisations d'images au montage du composant
  useEffect(() => {
    try {
      // Essayer d'abord sessionStorage (pour la même session)
      const storedPreviews = sessionStorage.getItem('listing_image_previews');
      if (storedPreviews) {
        const parsedPreviews = JSON.parse(storedPreviews);
        console.log("Prévisualisations chargées depuis sessionStorage:", parsedPreviews);
        setImagePreviews(parsedPreviews);
      } else {
        // Si rien dans sessionStorage, essayer localStorage
        const localStoredPreviews = localStorage.getItem('listing_image_previews');
        if (localStoredPreviews) {
          const parsedLocalPreviews = JSON.parse(localStoredPreviews);
          console.log("Prévisualisations chargées depuis localStorage:", parsedLocalPreviews);
          setImagePreviews(parsedLocalPreviews);
          
          // Synchroniser avec sessionStorage
          sessionStorage.setItem('listing_image_previews', localStoredPreviews);
        }
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
          console.log(`URL révoquée lors du démontage: ${url}`);
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
