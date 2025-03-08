
import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from '@/constants/locations';
import { getValidImageUrl } from './imageUtils';
import { FALLBACK_IMAGES } from '@/constants/images';

// Fonction pour normaliser un objet listing sans remplacer les images
export const normalizeListing = (listing: Listing): Listing => {
  // S'assurer que chaque listing a une propriété images
  const images = listing.images || [];
  
  // Si aucune image principale n'est spécifiée mais qu'il y a des images, utiliser la première
  const mainImage = listing.image || (images.length > 0 ? images[0] : getValidImageUrl("", 0));
  
  // Assurer que chaque listing a une propriété host
  const host = listing.host || { name: "Hôte", image: "/placeholder.svg" };
  
  // Assurer que c'est à Lomé avec un quartier spécifique
  const location = listing.location.includes("Lomé") 
    ? listing.location 
    : `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`;
  
  return {
    ...listing,
    image: mainImage,
    images: images.length > 0 ? images : [mainImage],
    host,
    location
  };
};
