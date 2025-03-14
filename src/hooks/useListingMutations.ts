
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { useListingsCloud } from "./useListingsCloud";

/**
 * Hook pour les opérations de mutation des logements (ajouter, mettre à jour, supprimer)
 */
export const useListingMutations = () => {
  const queryClient = useQueryClient();
  const { addListing, updateListing, deleteListing } = useListingsCloud();

  // Ajouter un nouveau logement
  const addListingMutation = useMutation({
    mutationFn: async (newListing: Omit<Listing, "id">) => {
      return await addListing(newListing);
    },
    onSuccess: (newListing) => {
      if (newListing) {
        queryClient.setQueryData(["listings"], (old: Listing[] = []) => [...old, newListing]);
        queryClient.invalidateQueries({ queryKey: ["listings"] });
      }
    }
  });

  // Mettre à jour un logement existant
  const updateListingMutation = useMutation({
    mutationFn: async (updatedListing: Listing) => {
      return await updateListing(updatedListing);
    },
    onSuccess: (updatedListing) => {
      if (updatedListing) {
        queryClient.setQueryData(["listings"], (old: Listing[] = []) =>
          old.map((listing) => listing.id === updatedListing.id ? updatedListing : listing)
        );
        queryClient.invalidateQueries({ queryKey: ["listings"] });
      }
    }
  });

  // Supprimer un logement
  const deleteListingMutation = useMutation({
    mutationFn: async (listingId: string) => {
      return await deleteListing(listingId);
    },
    onSuccess: (success, deletedId) => {
      if (success) {
        queryClient.setQueryData(["listings"], (old: Listing[] = []) =>
          old.filter((listing) => listing.id !== deletedId)
        );
        queryClient.invalidateQueries({ queryKey: ["listings"] });
      }
    }
  });

  return {
    addListing: addListingMutation,
    updateListing: updateListingMutation,
    deleteListing: deleteListingMutation
  };
};
