
import { useQuery } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { loadListings } from "../useListingStorage";
import { processStoredImages } from "./listingImageUtils";

/**
 * Hook for querying listings data
 */
export const useListingQueries = () => {
  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      try {
        const currentListings = loadListings();
        console.log("Chargement des listings:", currentListings.length);
        
        // Process listings and retrieve any stored images
        const verifiedListings = currentListings.map(listing => {
          if (!listing.images) listing.images = [];
          if (!listing.id) listing.id = Math.random().toString(36).substr(2, 9);
          
          return processStoredImages(listing);
        });
        
        return verifiedListings;
      } catch (loadError) {
        console.error("Erreur critique lors du chargement des listings:", loadError);
        
        try {
          // Try to recover from backup
          const backupKey = localStorage.getItem('listings_last_backup');
          if (backupKey) {
            const backupListings = JSON.parse(backupKey);
            console.log("Récupération depuis sauvegarde de secours:", backupListings.length);
            return backupListings;
          }
        } catch (backupError) {
          console.error("Échec de récupération de la sauvegarde:", backupError);
        }
        
        return [];
      }
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { listings, isLoading, error };
};
