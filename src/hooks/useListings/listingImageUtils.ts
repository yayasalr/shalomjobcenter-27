import { Listing } from "@/types/listing";

/**
 * Process stored images for a listing from localStorage
 */
export const processStoredImages = (listing: Listing): Listing => {
  if (!listing.id) return listing;
  
  try {
    const savedImagesStr = localStorage.getItem(`listing_images_${listing.id}`);
    if (savedImagesStr) {
      const savedImages = JSON.parse(savedImagesStr);
      if (Array.isArray(savedImages) && savedImages.length > 0) {
        console.log(`Images récupérées depuis localStorage pour le listing ${listing.id}:`, savedImages);
        // Ne pas écraser les images existantes si elles sont déjà présentes
        if (!listing.images || listing.images.length === 0) {
          listing.images = savedImages;
        }
        // Ne mettre à jour l'image principale que si elle n'existe pas
        if (!listing.image || listing.image.trim() === '') {
          listing.image = savedImages[0];
        }
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des images du listing ${listing.id}:`, error);
  }
  
  return listing;
};

/**
 * Save listing images to localStorage with timestamp to avoid collisions
 */
export const saveListingImages = (listingId: string, images: string[]): void => {
  if (!listingId || !images || images.length === 0) return;
  
  try {
    const key = `listing_images_${listingId}`;
    const timestamp = Date.now();
    const backupKey = `${key}_backup_${timestamp}`;
    
    // Sauvegarder une copie de sauvegarde d'abord
    const existingImages = localStorage.getItem(key);
    if (existingImages) {
      localStorage.setItem(backupKey, existingImages);
    }
    
    // Sauvegarder les nouvelles images
    localStorage.setItem(key, JSON.stringify(images));
    console.log(`Images sauvegardées pour le listing ${listingId}:`, images);
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des images pour le listing ${listingId}:`, error);
  }
};

/**
 * Clear all images for a listing from localStorage
 */
export const clearListingImages = (listingId: string): void => {
  if (!listingId) return;
  
  try {
    const timestamp = Date.now();
    const key = `listing_images_${listingId}`;
    const backupKey = `${key}_backup_${timestamp}`;
    
    // Créer une sauvegarde avant suppression
    const existingImages = localStorage.getItem(key);
    if (existingImages) {
      localStorage.setItem(backupKey, existingImages);
    }
    
    localStorage.removeItem(key);
    console.log(`Images supprimées pour le listing ${listingId}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression des images pour le listing ${listingId}:`, error);
  }
};

/**
 * Get primary image for a listing
 */
export const getListingPrimaryImage = (listing: Listing): string => {
  if (listing.image && listing.image.trim() !== '') {
    return listing.image;
  } else if (listing.images && listing.images.length > 0) {
    return listing.images[0];
  }
  return '';
};

/**
 * Purge all listing images from localStorage
 * This completely clears all images for all listings
 */
export const purgeAllListingImages = (): void => {
  try {
    // Find all image-related keys in localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('listing_images_')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove each key
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`${keysToRemove.length} entrées d'images de logements supprimées du localStorage`);
  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les images:', error);
  }
};
