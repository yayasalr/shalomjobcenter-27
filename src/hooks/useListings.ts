
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { MOCK_LISTINGS } from "@/data/mockData";

export const useListings = () => {
  const queryClient = useQueryClient();

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      // Ajout d'un log pour debug
      console.log("Chargement des listings depuis MOCK_LISTINGS:", MOCK_LISTINGS);
      return MOCK_LISTINGS;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 // Rafraîchissement toutes les secondes
  });

  const addListing = useMutation({
    mutationFn: async (newListing: Omit<Listing, "id">) => {
      const listing = {
        ...newListing,
        id: Math.random().toString(36).substr(2, 9),
      };
      MOCK_LISTINGS.push(listing);
      console.log("Nouveau listing ajouté:", listing); // Log pour debug
      return listing;
    },
    onSuccess: (newListing) => {
      queryClient.setQueryData(["listings"], (old: Listing[] = []) => [...old, newListing]);
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Logement ajouté avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout du logement");
    },
  });

  const updateListing = useMutation({
    mutationFn: async (updatedListing: Listing) => {
      const index = MOCK_LISTINGS.findIndex(listing => listing.id === updatedListing.id);
      if (index !== -1) {
        MOCK_LISTINGS[index] = updatedListing;
        console.log("Listing mis à jour:", updatedListing); // Log pour debug
      }
      return updatedListing;
    },
    onSuccess: (updatedListing) => {
      queryClient.setQueryData(["listings"], (old: Listing[] = []) =>
        old.map((listing) =>
          listing.id === updatedListing.id ? updatedListing : listing
        )
      );
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Logement mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du logement");
    },
  });

  const deleteListing = useMutation({
    mutationFn: async (listingId: string) => {
      const index = MOCK_LISTINGS.findIndex(listing => listing.id === listingId);
      if (index !== -1) {
        MOCK_LISTINGS.splice(index, 1);
        console.log("Listing supprimé:", listingId); // Log pour debug
      }
      return listingId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["listings"], (old: Listing[] = []) =>
        old.filter((listing) => listing.id !== deletedId)
      );
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Logement supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du logement");
    },
  });

  return {
    listings,
    isLoading,
    error,
    addListing,
    updateListing,
    deleteListing,
  };
};
