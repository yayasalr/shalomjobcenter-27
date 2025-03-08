
import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from '@/constants/locations';
import { getValidImageUrl } from './imageUtils';
import { FALLBACK_IMAGES } from '@/constants/images';

// Fonction pour normaliser un objet listing sans remplacer les images
export const normalizeListing = (listing: Listing): Listing => {
  // S'assurer que chaque listing a une propriété images
  const images = listing.images || [];
  
  // Conserver l'image principale si elle existe, sinon utiliser la première image du tableau
  // IMPORTANT: Ne pas remplacer les images existantes par des images de secours
  let mainImage = listing.image;
  if (!mainImage && images.length > 0) {
    mainImage = images[0];
  }
  
  // Assurer que chaque listing a une propriété host
  const host = listing.host || { name: "Hôte", image: "/placeholder.svg" };
  
  // Assurer que c'est à Lomé avec un quartier spécifique
  // Mais ne modifier la localisation que si elle n'est pas déjà définie
  const location = listing.location && listing.location.trim() !== "" 
    ? listing.location 
    : `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`;
  
  return {
    ...listing,
    image: mainImage,
    images: images.length > 0 ? images : (mainImage ? [mainImage] : []),
    host,
    location
  };
};
