
import { useQuery } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { loadListings } from "../useListingStorage";

/**
 * Custom hook to fetch listings data
 */
export const useFetchListings = () => {
  return useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const currentListings = loadListings();
      console.log("Chargement des listings:", currentListings);
      return currentListings;
    },
    staleTime: 0,
    gcTime: 0,
  });
};
