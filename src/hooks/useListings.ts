
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { MOCK_LISTINGS } from "@/data/mockData";

// Fonction pour charger les listings depuis le localStorage ou utiliser les données mock par défaut
const loadListings = (): Listing[] => {
  const savedListings = localStorage.getItem('listings');
  if (savedListings) {
    return JSON.parse(savedListings);
  }
  // Si aucune donnée n'existe dans le localStorage, utiliser les données mock et les sauvegarder
  localStorage.setItem('listings', JSON.stringify(MOCK_LISTINGS));
  return MOCK_LISTINGS;
};

// Fonction pour sauvegarder les listings dans le localStorage
const saveListings = (listings: Listing[]) => {
  localStorage.setItem('listings', JSON.stringify(listings));
};

export const useListings = () => {
  const queryClient = useQueryClient();

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const currentListings = loadListings();
      console.log("Chargement des listings:", currentListings);
      return currentListings;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000
  });

  const addListing = useMutation({
    mutationFn: async (newListing: Omit<Listing, "id">) => {
      const currentListings = loadListings();
      const listing = {
        ...newListing,
        id: Math.random().toString(36).substr(2, 9),
      };
      currentListings.push(listing);
      saveListings(currentListings);
      console.log("Nouveau listing ajouté:", listing);
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
      const currentListings = loadListings();
      const index = currentListings.findIndex(listing => listing.id === updatedListing.id);
      if (index !== -1) {
        currentListings[index] = updatedListing;
        saveListings(currentListings);
        console.log("Listing mis à jour:", updatedListing);
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
      const currentListings = loadListings();
      const index = currentListings.findIndex(listing => listing.id === listingId);
      if (index !== -1) {
        currentListings.splice(index, 1);
        saveListings(currentListings);
        console.log("Listing supprimé:", listingId);
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
