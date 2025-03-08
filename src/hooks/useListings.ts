
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { loadListings, saveListings } from "./useListingStorage";
import { loadReservations, saveReservations } from "./reservations";
import { normalizeListing } from "@/utils/listingUtils";
import { LOME_NEIGHBORHOODS } from "@/constants/locations";
import { FALLBACK_IMAGES } from "@/constants/images";

// Re-export constants for backward compatibility
export { LOME_NEIGHBORHOODS } from "@/constants/locations";
export { FALLBACK_IMAGES } from "@/constants/images";

export const useListings = () => {
  const queryClient = useQueryClient();

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const currentListings = loadListings();
      console.log("Chargement des listings:", currentListings.length);
      return currentListings;
    },
    staleTime: 0, // Toujours recharger les données
    gcTime: 0, // Ne pas mettre en cache
    refetchOnMount: true, // Recharger à chaque montage du composant
    refetchOnWindowFocus: true, // Recharger quand la fenêtre retrouve le focus
  });

  const addListing = useMutation({
    mutationFn: async (newListing: Omit<Listing, "id">) => {
      const currentListings = loadListings();
      
      // Créer un ID unique pour le nouveau listing
      const id = Math.random().toString(36).substr(2, 9);
      
      // Normaliser les données du listing sans modifier les images
      const listing: Listing = {
        ...newListing,
        id,
        rating: 0,
        dates: new Date().toLocaleDateString(),
        host: newListing.host || { name: "Hôte", image: "/placeholder.svg" }
      };
      
      // S'assurer que l'image principale est définie si nous avons des images
      if (!listing.image && listing.images && listing.images.length > 0) {
        listing.image = listing.images[0];
      }
      
      console.log("Nouveau listing avant ajout:", listing);
      currentListings.push(listing);
      saveListings(currentListings);
      console.log("Nouveau listing ajouté:", listing);
      return listing;
    },
    onSuccess: (newListing) => {
      // Mettre à jour immédiatement le cache
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
        // Préserver les données existantes et mettre à jour avec les nouvelles données
        const existingListing = currentListings[index];
        
        // Mise à jour du listing avec conservation des propriétés importantes
        currentListings[index] = {
          ...updatedListing,
          // Garantir que tous les champs requis existent
          rating: updatedListing.rating ?? existingListing.rating ?? 0,
          host: updatedListing.host || existingListing.host || { name: "Hôte", image: "/placeholder.svg" },
          // Conserver les images seulement si elles sont explicitement fournies
          image: updatedListing.image || existingListing.image,
          images: updatedListing.images || existingListing.images
        };
        
        console.log("Listing mis à jour:", currentListings[index]);
        saveListings(currentListings);
        return currentListings[index];
      }
      return updatedListing;
    },
    onSuccess: (updatedListing) => {
      // Mettre à jour immédiatement le cache
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
      // Mettre à jour immédiatement le cache
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

  const addReservation = useMutation({
    mutationFn: async (reservation: any) => {
      const currentReservations = loadReservations();
      const newReservation = {
        ...reservation,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      currentReservations.push(newReservation);
      saveReservations(currentReservations);
      console.log("Nouvelle réservation ajoutée:", newReservation);
      return newReservation;
    },
    onSuccess: (newReservation) => {
      // Mettre à jour immédiatement le cache des réservations
      queryClient.setQueryData(["reservations"], (old: any[] = []) => [...old, newReservation]);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Réservation effectuée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la réservation");
    }
  });

  const getReservations = () => {
    return loadReservations();
  };

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
