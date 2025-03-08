
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
 * Conserve l'URL originale dans presque tous les cas, 
 * n'utilise l'image de secours qu'en dernier recours
 */
export const getValidImageUrl = (imageUrl: string, index: number = 0): string => {
  // Si pas d'URL du tout ou explicitement null/undefined, utiliser une image de secours
  if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null' || imageUrl === '') {
    console.log(`URL d'image non valide (${imageUrl}), utilisation de l'image de secours`);
    return UNSPLASH_FALLBACKS[index % UNSPLASH_FALLBACKS.length];
  }
  
  // CRUCIAL: Préserver TOUTES les URLs qui ont un format valide
  // Blob URLs (pour les téléchargements récents)
  if (imageUrl.startsWith('blob:')) {
    console.log(`Préservation de l'URL blob: ${imageUrl}`);
    return imageUrl;
  }
  
  // URLs HTTP(S) (pour les images externes)
  if (imageUrl.startsWith('http')) {
    console.log(`Préservation de l'URL externe: ${imageUrl}`);
    return imageUrl;
  }
  
  // URLs de fichiers locaux
  if (imageUrl.startsWith('/')) {
    console.log(`Préservation du chemin local: ${imageUrl}`);
    return imageUrl;
  }
  
  // Data URLs (base64)
  if (imageUrl.startsWith('data:')) {
    console.log(`Préservation de l'URL data: ${imageUrl.substring(0, 20)}...`);
    return imageUrl;
  }
  
  // Si aucun des formats ci-dessus ne correspond, mais qu'une URL est fournie,
  // la conserver telle quelle, ne pas la remplacer par une image par défaut
  console.log(`Conservation de l'URL telle quelle: ${imageUrl}`);
  return imageUrl;
};

/**
 * Normalise un tableau d'images en préservant les URLs valides
 * Ne remplace JAMAIS les images fournies par des images par défaut
 */
export const normalizeImages = (images: string[] | undefined): string[] => {
  if (!images || images.length === 0) {
    console.log("Aucune image fournie, utilisation d'une image par défaut");
    return [getRandomFallbackImage()];
  }
  
  // Log pour le débogage
  console.log(`Normalisation d'un tableau de ${images.length} images sans remplacement`);
  
  // Conserver toutes les images du tableau sans remplacement automatique
  return images;
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
  
  // Préserver les URLs blob et HTTP
  if (avatarUrl.startsWith('blob:') || avatarUrl.startsWith('http')) {
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
