
import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from '@/constants/locations';
import { getValidImageUrl } from './imageUtils';
import { FALLBACK_IMAGES } from '@/constants/images';

// Fonction pour normaliser un objet listing sans JAMAIS remplacer les images
export const normalizeListing = (listing: Listing): Listing => {
  console.log("Normalisation d'un listing:", listing.title);
  
  // CRITIQUE: Ne JAMAIS modifier ou remplacer les images existantes
  // Simplement vérifier si elles existent et les utiliser telles quelles
  const images = listing.images || [];
  console.log("Images originales:", images);
  
  // Ne jamais modifier l'image principale si elle existe déjà
  let mainImage = listing.image;
  if (!mainImage && images.length > 0) {
    mainImage = images[0];
  }
  
  // Assurer que chaque listing a une propriété host
  const host = listing.host || { name: "Hôte", image: "/placeholder.svg" };
  
  // Gérer la localisation uniquement si elle n'est pas définie
  const location = listing.location && listing.location.trim() !== "" 
    ? listing.location 
    : `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`;
  
  console.log("Images préservées sans modification:", images);
  console.log("Image principale préservée:", mainImage);
  
  return {
    ...listing,
    image: mainImage,
    images: images,
    host,
    location
  };
};
