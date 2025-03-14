
import { useQuery } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { loadListings } from "../useListingStorage";
import { processStoredImages } from "./listingImageUtils";

/**
 * Hook pour interroger les données des annonces
 */
export const useListingQueries = () => {
  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      try {
        const currentListings = loadListings();
        console.log("Chargement des listings:", currentListings.length);
        
        // Traiter les annonces et récupérer les images stockées
        const verifiedListings = currentListings.map(listing => {
          if (!listing.images) listing.images = [];
          if (!listing.id) listing.id = Math.random().toString(36).substr(2, 9);
          
          return processStoredImages(listing);
        });
        
        return verifiedListings;
      } catch (loadError) {
        console.error("Erreur critique lors du chargement des listings:", loadError);
        
        try {
          // Essayer de récupérer à partir d'une sauvegarde
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
    // Rafraîchir les données à chaque montage et focus de fenêtre
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { listings, isLoading, error };
};
