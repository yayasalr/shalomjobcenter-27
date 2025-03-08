
import { useState, useEffect } from "react";
import { Listing } from "@/types/listing";
import { toast } from "sonner";

export const useImageHandlers = (initialImages: string[] = []) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialImages);

  // Effet pour charger les images initiales
  useEffect(() => {
    // Si des images sont fournies, les utiliser
    if (initialImages && initialImages.length > 0) {
      setImagePreviews(initialImages);
      console.log("Images initiales chargées:", initialImages);
    } else {
      // Essayer de récupérer des images depuis le localStorage
      try {
        const lastSavedImages = localStorage.getItem('latest_listing_images');
        if (lastSavedImages) {
          const parsedImages = JSON.parse(lastSavedImages);
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            setImagePreviews(parsedImages);
            console.log("Images récupérées depuis localStorage:", parsedImages);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des images:", error);
      }
    }
  }, []);

  // Ne pas mettre initialImages comme dépendance pour éviter les boucles infinies
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Ajouter les nouveaux fichiers à la liste existante
      setImages(prevImages => [...prevImages, ...filesArray]);
      
      // Créer des URL pour les prévisualisations
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      console.log("NOUVELLES IMAGES TÉLÉCHARGÉES:", newPreviews);
      
      // IMPORTANT: AJOUTER les nouvelles prévisualisations aux existantes, pas les remplacer
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
      
      // Sauvegarder toutes les images dans le localStorage
      try {
        const timestamp = Date.now();
        const key = `listing_images_${timestamp}`;
        
        // Récupérer les prévisualisations existantes et les combiner avec les nouvelles
        const allPreviews = [...imagePreviews, ...newPreviews];
        
        // Stocker dans localStorage pour une persistance maximale
        localStorage.setItem(key, JSON.stringify(allPreviews));
        
        // Clé de secours avec le timestamp actuel
        localStorage.setItem('latest_listing_images_timestamp', timestamp.toString());
        localStorage.setItem('latest_listing_images', JSON.stringify(allPreviews));
        
        toast.success(`${newPreviews.length} image(s) ajoutée(s)`);
        console.log(`Images totales stockées: ${allPreviews.length}`, allPreviews);
      } catch (error) {
        console.error('Erreur lors du stockage des prévisualisations:', error);
        toast.error("Erreur lors de l'enregistrement des images");
      }
    }
  };

  const removeImage = (index: number) => {
    // Supprimer le fichier de la liste des images
    setImages(prevImages => {
      const newImages = [...prevImages];
      if (index < newImages.length) {
        newImages.splice(index, 1);
      }
      return newImages;
    });
    
    // Révoquer l'URL de l'objet Blob si c'est un blob
    if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    
    // Mettre à jour les prévisualisations
    setImagePreviews(prevPreviews => {
      const updatedPreviews = prevPreviews.filter((_, i) => i !== index);
      
      // Mettre à jour les stockages
      try {
        const timestamp = Date.now();
        const key = `listing_images_${timestamp}`;
        
        localStorage.setItem(key, JSON.stringify(updatedPreviews));
        localStorage.setItem('latest_listing_images_timestamp', timestamp.toString());
        localStorage.setItem('latest_listing_images', JSON.stringify(updatedPreviews));
        
        toast.success("Image supprimée");
        console.log("Images mises à jour après suppression:", updatedPreviews);
      } catch (error) {
        console.error('Erreur lors de la mise à jour des prévisualisations:', error);
      }
      
      return updatedPreviews;
    });
  };

  const resetImages = () => {
    // Nettoyer les URL blob pour éviter les fuites mémoire
    imagePreviews.forEach(url => {
      if (url && typeof url === 'string' && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    setImages([]);
    setImagePreviews([]);
    
    // Nettoyer également le localStorage
    localStorage.removeItem('latest_listing_images');
    localStorage.removeItem('latest_permanent_images');
    
    toast.success("Toutes les images ont été supprimées");
  };

  // Nettoyer les URL blob lors du démontage du composant
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
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
