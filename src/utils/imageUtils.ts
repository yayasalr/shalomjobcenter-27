
import { FALLBACK_IMAGES } from '@/constants/images';
import { compressImage, cleanupImageUrls } from '@/hooks/upload';

// Fonction pour obtenir une image valide à partir d'une URL
export const getValidImageUrl = (imageUrl: string, index: number = 0): string => {
  if (!imageUrl) return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  
  if (imageUrl.startsWith('blob:')) {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  }
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('/') && (imageUrl === '/placeholder.svg' || imageUrl.includes('lovable-uploads'))) {
    return imageUrl;
  }
  
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

// Fonction pour normaliser un tableau d'images
export const normalizeImages = (images: string[] | undefined): string[] => {
  if (!images || images.length === 0) {
    return [FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)]];
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
