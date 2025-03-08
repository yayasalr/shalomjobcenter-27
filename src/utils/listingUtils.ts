
import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from '@/constants/locations';
import { FALLBACK_IMAGES } from '@/constants/images';

// Fonction pour normaliser un objet listing en PRÉSERVANT les images existantes
export const normalizeListing = (listing: Listing): Listing => {
  console.log("Normalisation du listing:", listing.title || 'Nouveau listing');
  
  // Créer des copies profondes pour éviter les références
  const images = listing.images ? [...listing.images] : [];
  const mainImage = listing.image ? listing.image : '';
  
  console.log("Images originales:", images);
  console.log("Image principale originale:", mainImage);
  
  // CRITIQUE: Toujours préserver les images existantes
  let finalImages = images;
  let finalMainImage = mainImage;
  
  // Vérifier si des images sont stockées dans localStorage pour ce listing
  if (listing.id) {
    try {
      const savedImagesStr = localStorage.getItem(`listing_images_${listing.id}`);
      if (savedImagesStr) {
        const savedImages = JSON.parse(savedImagesStr);
        if (Array.isArray(savedImages) && savedImages.length > 0) {
          console.log(`Images récupérées depuis localStorage pour le listing ${listing.id}:`, savedImages);
          finalImages = savedImages;
          // Si l'image principale est vide mais qu'il y a des images sauvegardées, utiliser la première
          if (!finalMainImage && savedImages.length > 0) {
            finalMainImage = savedImages[0];
          }
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération des images du listing ${listing.id}:`, error);
    }
  }
  
  // Si aucune image n'est fournie, seulement dans ce cas utiliser une image par défaut
  if (finalImages.length === 0 && !finalMainImage) {
    console.log("Aucune image fournie, utilisation d'une image par défaut");
    const defaultImage = FALLBACK_IMAGES[0];
    finalMainImage = defaultImage;
    finalImages = [defaultImage];
  }
  
  // Assurer que chaque listing a une propriété host
  const host = listing.host || { name: "Hôte", image: "/placeholder.svg" };
  
  // Gérer la localisation uniquement si elle n'est pas définie
  const location = listing.location && listing.location.trim() !== "" 
    ? listing.location 
    : `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`;
  
  console.log("Images finales:", finalImages);
  console.log("Image principale finale:", finalMainImage);
  
  return {
    ...listing,
    image: finalMainImage,
    images: finalImages,
    host,
    location
  };
};
