
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { loadListings, saveListings } from "./useListingStorage";
import { loadReservations, saveReservations } from "./reservations";
import { LOME_NEIGHBORHOODS } from "@/constants/locations";
import { FALLBACK_IMAGES } from "@/constants/images";

export { LOME_NEIGHBORHOODS } from "@/constants/locations";
export { FALLBACK_IMAGES } from "@/constants/images";

export const useListings = () => {
  const queryClient = useQueryClient();

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      try {
        const currentListings = loadListings();
        console.log("Chargement des listings:", currentListings.length);
        
        const verifiedListings = currentListings.map(listing => {
          if (!listing.images) listing.images = [];
          if (!listing.id) listing.id = Math.random().toString(36).substr(2, 9);
          
          // Vérifier si des images sont stockées dans localStorage pour ce listing
          try {
            const savedImagesStr = localStorage.getItem(`listing_images_${listing.id}`);
            if (savedImagesStr) {
              const savedImages = JSON.parse(savedImagesStr);
              if (Array.isArray(savedImages) && savedImages.length > 0) {
                console.log(`Images récupérées depuis localStorage pour le listing ${listing.id}:`, savedImages);
                listing.images = savedImages;
                if (savedImages.length > 0 && (!listing.image || listing.image.trim() === '')) {
                  listing.image = savedImages[0];
                }
              }
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération des images du listing ${listing.id}:`, error);
          }
          
          return listing;
        });
        
        return verifiedListings;
      } catch (loadError) {
        console.error("Erreur critique lors du chargement des listings:", loadError);
        
        try {
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
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const addListing = useMutation({
    mutationFn: async (newListing: Omit<Listing, "id">) => {
      try {
        const currentListings = loadListings();
        
        const id = Math.random().toString(36).substr(2, 9);
        
        const listing: Listing = {
          ...newListing,
          id,
          rating: 0,
          dates: new Date().toLocaleDateString(),
          host: newListing.host || { name: "Hôte", image: "/placeholder.svg" }
        };
        
        console.log("Images fournies lors de la création:", newListing.images);
        console.log("Image principale fournie lors de la création:", newListing.image);
        
        if (newListing.images && newListing.images.length > 0) {
          listing.images = [...newListing.images];
          localStorage.setItem(`listing_images_${id}`, JSON.stringify(listing.images));
        } else {
          listing.images = [];
        }
        
        if (newListing.image) {
          listing.image = newListing.image;
        } else if (listing.images && listing.images.length > 0) {
          listing.image = listing.images[0];
        }
        
        console.log("Données finales du nouveau listing:", listing);
        
        currentListings.push(listing);
        saveListings(currentListings);
        
        return listing;
      } catch (error) {
        console.error("Erreur lors de l'ajout du listing:", error);
        throw error;
      }
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
      try {
        const currentListings = loadListings();
        const index = currentListings.findIndex(listing => listing.id === updatedListing.id);
        
        if (index !== -1) {
          const existingListing = currentListings[index];
          localStorage.setItem(`listing_backup_${existingListing.id}`, JSON.stringify(existingListing));
          
          console.log("Images fournies pour la mise à jour:", updatedListing.images);
          console.log("Image principale fournie pour la mise à jour:", updatedListing.image);
          
          if (updatedListing.images && updatedListing.images.length > 0) {
            localStorage.setItem(`listing_images_${updatedListing.id}`, JSON.stringify(updatedListing.images));
          } else if (existingListing.images && existingListing.images.length > 0) {
            updatedListing.images = [...existingListing.images];
          }
          
          if (updatedListing.image) {
            localStorage.setItem(`listing_image_${updatedListing.id}`, updatedListing.image);
          } else if (updatedListing.images && updatedListing.images.length > 0) {
            updatedListing.image = updatedListing.images[0];
          } else if (existingListing.image) {
            updatedListing.image = existingListing.image;
          }
          
          currentListings[index] = updatedListing;
          saveListings(currentListings);
          return updatedListing;
        }
        
        throw new Error(`Listing avec ID ${updatedListing.id} non trouvé`);
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du listing:`, error);
        throw error;
      }
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
        const deletedListing = currentListings[index];
        
        localStorage.setItem(`deleted_listing_${listingId}`, JSON.stringify(deletedListing));
        
        currentListings.splice(index, 1);
        saveListings(currentListings);
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
