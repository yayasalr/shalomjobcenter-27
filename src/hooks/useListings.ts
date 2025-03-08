
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { loadListings, saveListings } from "./useListingStorage";
import { loadReservations, saveReservations } from "./reservations";
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
      
      // Créer une copie complète pour préserver toutes les données
      const listing: Listing = {
        ...newListing,
        id,
        rating: 0,
        dates: new Date().toLocaleDateString(),
        host: newListing.host || { name: "Hôte", image: "/placeholder.svg" }
      };
      
      // TRÈS IMPORTANT: Préserver explicitement toutes les images
      console.log("Images fournies lors de la création:", newListing.images);
      console.log("Image principale fournie lors de la création:", newListing.image);
      
      if (newListing.images && newListing.images.length > 0) {
        listing.images = [...newListing.images];
        // Sauvegarde de sécurité des images
        localStorage.setItem(`new_listing_${id}_images`, JSON.stringify(listing.images));
        
        // Si pas d'image principale mais des images disponibles, utiliser la première
        if (!newListing.image && newListing.images.length > 0) {
          listing.image = newListing.images[0];
          localStorage.setItem(`new_listing_${id}_main_image`, listing.image);
        }
      }
      
      if (newListing.image) {
        listing.image = newListing.image;
        localStorage.setItem(`new_listing_${id}_main_image`, listing.image);
      }
      
      console.log("Données finales du nouveau listing avant ajout:", listing);
      
      // Ajout du listing à la liste
      currentListings.push(listing);
      saveListings(currentListings);
      
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
        // Sauvegarde de sécurité des données originales
        const existingListing = currentListings[index];
        localStorage.setItem(`old_listing_${existingListing.id}_backup`, JSON.stringify(existingListing));
        
        console.log("Images fournies pour la mise à jour:", updatedListing.images);
        console.log("Image principale fournie pour la mise à jour:", updatedListing.image);
        
        // Préserver les images si spécifiées dans la mise à jour
        if (updatedListing.images && updatedListing.images.length > 0) {
          console.log("Utilisation des nouvelles images pour la mise à jour");
          localStorage.setItem(`updated_listing_${updatedListing.id}_images`, JSON.stringify(updatedListing.images));
        } else if (existingListing.images && existingListing.images.length > 0) {
          console.log("Conservation des images existantes pour la mise à jour");
          updatedListing.images = [...existingListing.images];
        }
        
        if (updatedListing.image) {
          console.log("Utilisation de la nouvelle image principale pour la mise à jour");
          localStorage.setItem(`updated_listing_${updatedListing.id}_main_image`, updatedListing.image);
        } else if (existingListing.image) {
          console.log("Conservation de l'image principale existante pour la mise à jour");
          updatedListing.image = existingListing.image;
        }
        
        // Remplacer le listing existant par le listing mis à jour
        currentListings[index] = updatedListing;
        saveListings(currentListings);
        return updatedListing;
      }
      
      throw new Error(`Listing avec ID ${updatedListing.id} non trouvé pour la mise à jour`);
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
        const deletedListing = currentListings[index];
        
        // Sauvegarde du listing supprimé
        localStorage.setItem(`deleted_listing_${listingId}`, JSON.stringify(deletedListing));
        
        currentListings.splice(index, 1);
        saveListings(currentListings);
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
