
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

// Fonction pour obtenir une image valide à partir d'une URL
export const getValidImageUrl = (imageUrl: string, index: number = 0): string => {
  if (!imageUrl) return UNSPLASH_FALLBACKS[index % UNSPLASH_FALLBACKS.length];
  
  if (imageUrl.startsWith('blob:')) {
    console.log("Conversion d'une URL blob en fallback:", imageUrl);
    return UNSPLASH_FALLBACKS[index % UNSPLASH_FALLBACKS.length];
  }
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('/') && (imageUrl === '/placeholder.svg' || imageUrl.includes('lovable-uploads'))) {
    return imageUrl;
  }
  
  console.log("Utilisation d'une image de secours pour:", imageUrl);
  return UNSPLASH_FALLBACKS[index % UNSPLASH_FALLBACKS.length];
};

// Fonction pour normaliser un tableau d'images
export const normalizeImages = (images: string[] | undefined): string[] => {
  if (!images || images.length === 0) {
    return [UNSPLASH_FALLBACKS[Math.floor(Math.random() * UNSPLASH_FALLBACKS.length)]];
  }
  
  return images.map((img, index) => getValidImageUrl(img, index));
};

// Re-export the image utility functions from the new location
export { compressImage, cleanupImageUrls };

// Fonction pour obtenir une image d'avatar pour les propriétaires
export const getHostAvatar = (avatarUrl: string | undefined): string => {
  if (!avatarUrl) return "/placeholder.svg";
  
  if (avatarUrl.startsWith('blob:') || !avatarUrl) {
    return "/placeholder.svg";
  }
  
  return avatarUrl;
};

// Fonction pour obtenir une image de secours aléatoire
export const getRandomFallbackImage = (): string => {
  return UNSPLASH_FALLBACKS[Math.floor(Math.random() * UNSPLASH_FALLBACKS.length)];
};
