
import { FALLBACK_IMAGES } from '@/hooks/useListings';

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
