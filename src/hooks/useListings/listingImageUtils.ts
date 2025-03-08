
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
        listing.images = savedImages;
        if (savedImages.length > 0 && (!listing.image || listing.image.trim() === '')) {
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
 * Save listing images to localStorage
 */
export const saveListingImages = (listingId: string, images: string[]): void => {
  if (!listingId || !images || images.length === 0) return;
  
  try {
    localStorage.setItem(`listing_images_${listingId}`, JSON.stringify(images));
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
    localStorage.removeItem(`listing_images_${listingId}`);
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
