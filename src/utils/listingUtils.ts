
import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from '@/constants/locations';
import { getValidImageUrl } from './imageUtils';
import { FALLBACK_IMAGES } from '@/constants/images';

// Fonction pour normaliser un objet listing sans JAMAIS remplacer les images
export const normalizeListing = (listing: Listing): Listing => {
  // Créer des copies profondes pour éviter les références
  const images = listing.images ? [...listing.images] : [];
  const mainImage = listing.image ? listing.image : '';
  
  // CRITIQUE: TOUJOURS préserver les images existantes sans exception
  console.log("Normalisation du listing:", listing.title);
  console.log("Images originales:", images);
  console.log("Image principale originale:", mainImage);
  
  // Ne plus toucher aux images, sauf si absolument aucune n'existe
  let finalMainImage = mainImage;
  let finalImages = images;
  
  // Si absolument aucune image n'est fournie, seulement dans ce cas utiliser une image par défaut
  if (finalImages.length === 0 && !finalMainImage) {
    console.log("Aucune image fournie, utilisation d'une image par défaut");
    finalMainImage = FALLBACK_IMAGES[0];
  }
  
  // Assurer que chaque listing a une propriété host
  const host = listing.host || { name: "Hôte", image: "/placeholder.svg" };
  
  // Gérer la localisation uniquement si elle n'est pas définie
  const location = listing.location && listing.location.trim() !== "" 
    ? listing.location 
    : `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`;
  
  console.log("Images finales préservées:", finalImages);
  console.log("Image principale finale:", finalMainImage);
  
  return {
    ...listing,
    image: finalMainImage,
    images: finalImages,
    host,
    location
  };
};
