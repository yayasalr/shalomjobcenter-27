
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
      
      // Préserver explicitement les images
      if (newListing.images) {
        listing.images = newListing.images;
        console.log("Images préservées lors de l'ajout:", listing.images);
      }
      
      if (newListing.image) {
        listing.image = newListing.image;
        console.log("Image principale préservée lors de l'ajout:", listing.image);
      }
      
      // S'assurer que l'image principale existe si nous avons des images
      if (!listing.image && listing.images && listing.images.length > 0) {
        listing.image = listing.images[0];
        console.log("Image principale définie à partir des images:", listing.image);
      }
      
      console.log("Nouveau listing avant ajout:", listing);
      
      // Enregistrement en localStorage pour durabilité maximale
      try {
        if (listing.images && listing.images.length > 0) {
          localStorage.setItem(`listing_images_${id}`, JSON.stringify(listing.images));
          console.log(`Images du listing ${id} sauvegardées séparément`);
        }
        
        if (listing.image) {
          localStorage.setItem(`listing_main_image_${id}`, listing.image);
          console.log(`Image principale du listing ${id} sauvegardée séparément`);
        }
      } catch (err) {
        console.error("Erreur lors de la sauvegarde séparée des images:", err);
      }
      
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
        console.log("Mise à jour du listing avec ID:", updatedListing.id);
        console.log("Images dans la mise à jour:", updatedListing.images);
        console.log("Image principale dans la mise à jour:", updatedListing.image);
        
        // Préserver les données existantes et mettre à jour avec les nouvelles données
        const existingListing = currentListings[index];
        
        // Créer une copie modifiée du listing
        const updatedCopy = {...updatedListing};
        
        // Garantir que tous les champs requis existent
        updatedCopy.rating = updatedListing.rating ?? existingListing.rating ?? 0;
        updatedCopy.host = updatedListing.host || existingListing.host || { name: "Hôte", image: "/placeholder.svg" };
        
        // Préserver explicitement les images fournies
        if (updatedListing.images && updatedListing.images.length > 0) {
          // Enregistrement séparé des images pour plus de durabilité
          try {
            localStorage.setItem(`listing_images_${updatedListing.id}`, JSON.stringify(updatedListing.images));
            console.log(`Images du listing ${updatedListing.id} sauvegardées séparément lors de la mise à jour`);
          } catch (err) {
            console.error("Erreur lors de la sauvegarde séparée des images:", err);
          }
        } else if (existingListing.images && existingListing.images.length > 0) {
          // Si pas de nouvelles images, conserver les anciennes
          updatedCopy.images = existingListing.images;
          console.log("Conservation des images existantes:", existingListing.images);
        }
        
        // Préserver l'image principale
        if (updatedListing.image) {
          try {
            localStorage.setItem(`listing_main_image_${updatedListing.id}`, updatedListing.image);
            console.log(`Image principale du listing ${updatedListing.id} sauvegardée séparément lors de la mise à jour`);
          } catch (err) {
            console.error("Erreur lors de la sauvegarde séparée de l'image principale:", err);
          }
        } else if (existingListing.image) {
          // Si pas de nouvelle image principale, conserver l'ancienne
          updatedCopy.image = existingListing.image;
          console.log("Conservation de l'image principale existante:", existingListing.image);
        }
        
        // Mettre à jour le listing
        currentListings[index] = updatedCopy;
        console.log("Listing après mise à jour:", updatedCopy);
        
        saveListings(currentListings);
        return updatedCopy;
      }
      
      console.warn("Listing non trouvé pour la mise à jour, ID:", updatedListing.id);
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
        // Nettoyer les données d'images stockées séparément
        try {
          localStorage.removeItem(`listing_images_${listingId}`);
          localStorage.removeItem(`listing_main_image_${listingId}`);
          console.log(`Données d'images séparées du listing ${listingId} supprimées`);
        } catch (err) {
          console.error("Erreur lors de la suppression des données d'images séparées:", err);
        }
        
        // Supprimer le listing
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
