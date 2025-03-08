
import { FALLBACK_IMAGES } from '@/constants/images';
import { compressImage, cleanupImageUrls } from '@/hooks/upload';

// Images de secours alternatives (des images stables d'Unsplash)
const UNSPLASH_FALLBACKS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", 
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800"
];

/**
 * Obtenir une URL d'image valide à partir d'une URL
 * Gère les cas d'erreur avec des images de secours
 */
export const getValidImageUrl = (imageUrl: string, index: number = 0): string => {
  // Si pas d'URL, utiliser une image de secours
  if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
    console.log("URL d'image manquante, utilisation d'une image de secours");
    return UNSPLASH_FALLBACKS[index % UNSPLASH_FALLBACKS.length];
  }
  
  // Préserver les URLs blob pour les images fraîchement téléchargées
  if (imageUrl.startsWith('blob:')) {
    console.log("Préservation d'une URL blob:", imageUrl);
    return imageUrl;
  }
  
  // URLs HTTP(S) sont valides
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Chemins locaux valides
  if (imageUrl.startsWith('/')) {
    if (imageUrl === '/placeholder.svg' || imageUrl.includes('lovable-uploads')) {
      return imageUrl;
    }
    // Autres chemins locaux peuvent être invalides
    console.log("Chemin local potentiellement invalide:", imageUrl);
  }
  
  // Par défaut, utiliser une image de secours
  console.log("Utilisation d'une image de secours pour:", imageUrl);
  return UNSPLASH_FALLBACKS[index % UNSPLASH_FALLBACKS.length];
};

/**
 * Normalise un tableau d'images en préservant les URLs valides
 */
export const normalizeImages = (images: string[] | undefined): string[] => {
  if (!images || images.length === 0) {
    return [getRandomFallbackImage()];
  }
  
  // Vérifier si le tableau contient des URLs blob
  const hasValidImages = images.some(img => img.startsWith('blob:') || img.startsWith('http'));
  
  // Si des URLs valides existent, les utiliser, sinon utiliser les fallbacks
  if (hasValidImages) {
    return images;
  }
  
  return images.map((img, index) => getValidImageUrl(img, index));
};

// Re-export the image utility functions from the new location
export { compressImage, cleanupImageUrls };

/**
 * Obtenir une image d'avatar valide pour les propriétaires
 */
export const getHostAvatar = (avatarUrl: string | undefined): string => {
  if (!avatarUrl) {
    return "/placeholder.svg";
  }
  
  // Préserver les URLs blob
  if (avatarUrl.startsWith('blob:')) {
    return avatarUrl;
  }
  
  return avatarUrl;
};

/**
 * Obtenir une image de secours aléatoire
 */
export const getRandomFallbackImage = (): string => {
  return UNSPLASH_FALLBACKS[Math.floor(Math.random() * UNSPLASH_FALLBACKS.length)];
};

/**
 * Vérifier si une image est valide via une promesse
 */
export const isImageValid = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    
    // Les URLs blob sont considérées comme valides
    if (url.startsWith('blob:')) {
      resolve(true);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Récupérer la première image valide d'un tableau
 */
export const getFirstValidImage = async (images: string[]): Promise<string> => {
  if (!images || images.length === 0) {
    return getRandomFallbackImage();
  }
  
  for (const img of images) {
    const isValid = await isImageValid(img);
    if (isValid) return img;
  }
  
  return getRandomFallbackImage();
};
