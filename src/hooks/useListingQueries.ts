
import { useQuery } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { useListingsCloud } from "./useListingsCloud";

/**
 * Hook pour interroger les données des annonces depuis Supabase
 */
export const useListingQueries = () => {
  const { getListings } = useListingsCloud();

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      try {
        const currentListings = await getListings();
        console.log("Chargement des listings depuis Supabase:", currentListings.length);
        return currentListings;
      } catch (err) {
        console.error("Erreur critique lors du chargement des listings:", err);
        return [];
      }
    },
    // Rafraîchir les données à chaque montage et focus de fenêtre
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { listings, isLoading, error };
};
