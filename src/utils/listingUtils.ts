
import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from '@/constants/locations';
import { getValidImageUrl } from './imageUtils';
import { FALLBACK_IMAGES } from '@/constants/images';

// Fonction pour normaliser un objet listing sans JAMAIS remplacer les images
export const normalizeListing = (listing: Listing): Listing => {
  console.log("Normalisation d'un listing:", listing.title);
  
  // CRITIQUE: TOUJOURS préserver les images existantes sans exception
  // Créer des copies profondes pour éviter les références
  const images = listing.images ? [...listing.images] : [];
  let mainImage = listing.image ? listing.image : '';
  
  console.log("Images d'origine STRICTEMENT préservées:", images);
  console.log("Image principale d'origine:", mainImage);
  
  // Si aucune image n'est fournie du tout, seulement dans ce cas utiliser des images par défaut
  if (images.length === 0 && !mainImage) {
    console.log("Aucune image fournie, utilisation d'une image par défaut");
    
    // Dans ce cas seulement, utiliser une image par défaut
    mainImage = FALLBACK_IMAGES[0];
  }
  
  // Assurer que chaque listing a une propriété host
  const host = listing.host || { name: "Hôte", image: "/placeholder.svg" };
  
  // Gérer la localisation uniquement si elle n'est pas définie
  const location = listing.location && listing.location.trim() !== "" 
    ? listing.location 
    : `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`;
  
  // Garder une copie séparée des images pour vérification
  localStorage.setItem(`original_images_${listing.id || Date.now()}`, JSON.stringify(images));
  if (mainImage) {
    localStorage.setItem(`original_main_image_${listing.id || Date.now()}`, mainImage);
  }
  
  console.log("Images finales préservées:", images);
  console.log("Image principale finale:", mainImage);
  
  return {
    ...listing,
    image: mainImage,
    images: images,
    host,
    location
  };
};
