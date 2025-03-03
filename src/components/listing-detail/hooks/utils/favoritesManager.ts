
import { toast } from "sonner";

/**
 * Check if a listing is in favorites
 */
export const checkIsFavorite = (listingId: string | undefined): boolean => {
  if (!listingId) return false;
  
  const favorites = localStorage.getItem("favorites");
  if (!favorites) return false;
  
  try {
    const favList = JSON.parse(favorites);
    return Array.isArray(favList) && favList.includes(listingId);
  } catch (error) {
    console.error("Error parsing favorites:", error);
    return false;
  }
};

/**
 * Toggle a listing's favorite status
 */
export const toggleFavoriteStatus = (
  listingId: string | undefined, 
  currentStatus: boolean
): boolean => {
  if (!listingId) return currentStatus;

  let favorites: string[] = [];
  const storedFavorites = localStorage.getItem("favorites");

  if (storedFavorites) {
    try {
      favorites = JSON.parse(storedFavorites);
      if (!Array.isArray(favorites)) favorites = [];
    } catch (error) {
      console.error("Error parsing favorites:", error);
    }
  }

  // Add or remove from favorites
  if (currentStatus) {
    favorites = favorites.filter((id) => id !== listingId);
    toast.success("Retiré des favoris");
  } else {
    favorites.push(listingId);
    toast.success("Ajouté aux favoris");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  return !currentStatus;
};
