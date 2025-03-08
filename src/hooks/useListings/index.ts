
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { loadListings, saveListings } from "../useListingStorage";
import { useListingQueries } from "./useListingQueries";
import { useListingMutations } from "./useListingMutations";
import { useReservationMutations } from "./useReservationMutations";

export { LOME_NEIGHBORHOODS } from "@/constants/locations";
export { FALLBACK_IMAGES } from "@/constants/images";

/**
 * Main hook that combines all listing operations
 */
export const useListings = () => {
  const { listings, isLoading, error } = useListingQueries();
  const { addListing, updateListing, deleteListing } = useListingMutations();
  const { addReservation, getReservations } = useReservationMutations();

  return {
    listings,
    isLoading,
    error,
    addListing,
    updateListing,
    deleteListing,
    addReservation,
    getReservations
  };
};
