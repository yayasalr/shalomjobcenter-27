
/**
 * Returns a random image from the fallback images array
 */
export const getFallbackImage = (fallbackImages: string[]): string => {
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
};
