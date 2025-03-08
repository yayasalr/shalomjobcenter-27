
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
      
      // AMÉLIORATION: Triple stockage pour une persistance maximale
      try {
        // 1. SessionStorage (pour la session actuelle)
        const storedPreviews = sessionStorage.getItem('listing_image_previews');
        const currentPreviews = storedPreviews ? JSON.parse(storedPreviews) : [];
        const updatedPreviews = [...currentPreviews, ...newPreviews];
        sessionStorage.setItem('listing_image_previews', JSON.stringify(updatedPreviews));
        
        // 2. LocalStorage (persistance à long terme)
        localStorage.setItem('listing_image_previews', JSON.stringify(updatedPreviews));
        
        // 3. Stockage individuel de chaque URL (ultra-redondant)
        newPreviews.forEach((url, idx) => {
          const key = `listing_image_preview_${Date.now()}_${idx}`;
          localStorage.setItem(key, url);
          
          // Stockage additionnel avec horodatage pour éviter les conflits
          const backupKey = `listing_image_backup_${new Date().toISOString()}_${idx}`;
          localStorage.setItem(backupKey, url);
        });
        
        console.log("Triple sauvegarde des images effectuée pour une persistance maximale");
      } catch (error) {
        console.error('Erreur lors du stockage des prévisualisations:', error);
      }
      
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // Révoquer l'URL de l'objet Blob pour éviter les fuites de mémoire
    if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    
    // Mettre à jour tous les stockages
    try {
      const storedPreviews = sessionStorage.getItem('listing_image_previews');
      if (storedPreviews) {
        const currentPreviews = JSON.parse(storedPreviews);
        currentPreviews.splice(index, 1);
        
        // Mettre à jour les deux stockages
        sessionStorage.setItem('listing_image_previews', JSON.stringify(currentPreviews));
        localStorage.setItem('listing_image_previews', JSON.stringify(currentPreviews));
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
    
    // Ne pas effacer le stockage - cela permet de récupérer les images
    // même après réinitialisation accidentelle
    
    setImages([]);
    setImagePreviews([]);
  };

  // Charger les prévisualisations d'images au montage du composant avec priorité
  useEffect(() => {
    try {
      // Priorité 1: Images de la dernière soumission
      const lastSubmittedImages = localStorage.getItem('last_listing_images');
      if (lastSubmittedImages) {
        console.log("Restauration des images de la dernière soumission");
        const parsedImages = JSON.parse(lastSubmittedImages);
        setImagePreviews(parsedImages);
        return;
      }
      
      // Priorité 2: Images de la session en cours
      const sessionImages = sessionStorage.getItem('listing_image_previews');
      if (sessionImages) {
        console.log("Restauration des images de la session en cours");
        const parsedImages = JSON.parse(sessionImages);
        setImagePreviews(parsedImages);
        return;
      }
      
      // Priorité 3: Images du stockage local
      const localStoredImages = localStorage.getItem('listing_image_previews');
      if (localStoredImages) {
        console.log("Restauration des images du stockage local");
        const parsedImages = JSON.parse(localStoredImages);
        setImagePreviews(parsedImages);
        
        // Synchroniser avec sessionStorage
        sessionStorage.setItem('listing_image_previews', localStoredImages);
      }
      
      // Priorité 4: Récupération des images individuelles
      // Cette méthode est expérimentale et sert de dernier recours
      else {
        console.log("Tentative de récupération d'images individuelles");
        const recoveredImages: string[] = [];
        
        // Parcourir le localStorage pour trouver des images
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('listing_image_preview_') || key.startsWith('listing_image_backup_'))) {
            const imageUrl = localStorage.getItem(key);
            if (imageUrl && !recoveredImages.includes(imageUrl)) {
              recoveredImages.push(imageUrl);
            }
          }
        }
        
        if (recoveredImages.length > 0) {
          console.log(`Récupération de ${recoveredImages.length} images individuelles`);
          setImagePreviews(recoveredImages);
          
          // Synchroniser avec les autres stockages
          sessionStorage.setItem('listing_image_previews', JSON.stringify(recoveredImages));
          localStorage.setItem('listing_image_previews', JSON.stringify(recoveredImages));
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des prévisualisations:', error);
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
