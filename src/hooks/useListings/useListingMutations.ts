import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { loadListings, saveListings } from "../useListingStorage";
import { processStoredImages, saveListingImages, clearListingImages, purgeAllListingImages } from "./listingImageUtils";

/**
 * Hook for listing mutation operations (add, update, delete)
 */
export const useListingMutations = () => {
  const queryClient = useQueryClient();

  // Add new listing
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
        
        // Ensure images array exists
        if (!listing.images) {
          listing.images = [];
        }
        
        // Save images to localStorage
        if (newListing.images && newListing.images.length > 0) {
          listing.images = [...newListing.images];
          saveListingImages(id, listing.images);
        }
        
        // Set main image
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

  // Update existing listing
  const updateListing = useMutation({
    mutationFn: async (updatedListing: Listing) => {
      try {
        const currentListings = loadListings();
        const index = currentListings.findIndex(listing => listing.id === updatedListing.id);
        
        if (index !== -1) {
          // Create backup of the existing listing
          const existingListing = currentListings[index];
          localStorage.setItem(`listing_backup_${existingListing.id}`, JSON.stringify(existingListing));
          
          console.log("Images fournies pour la mise à jour:", updatedListing.images);
          console.log("Image principale fournie pour la mise à jour:", updatedListing.image);
          
          // Clear existing images first if new images are provided
          if (updatedListing.images && updatedListing.images.length > 0) {
            clearListingImages(updatedListing.id);
            saveListingImages(updatedListing.id, updatedListing.images);
          } else if (existingListing.images && existingListing.images.length > 0) {
            // Keep existing images if no new ones provided
            updatedListing.images = [...existingListing.images];
          } else {
            updatedListing.images = [];
          }
          
          // Handle main image
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

  // Delete listing
  const deleteListing = useMutation({
    mutationFn: async (listingId: string) => {
      const currentListings = loadListings();
      const index = currentListings.findIndex(listing => listing.id === listingId);
      if (index !== -1) {
        const deletedListing = currentListings[index];
        
        // Create backup before deletion
        localStorage.setItem(`deleted_listing_${listingId}`, JSON.stringify(deletedListing));
        
        // Clear images from storage
        clearListingImages(listingId);
        
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

  // Clear all listing images (global operation)
  const clearAllListingImages = useMutation({
    mutationFn: async () => {
      // Purge all images from localStorage
      try {
        purgeAllListingImages();
        
        // Update all listings to have empty image arrays
        const currentListings = loadListings();
        const updatedListings = currentListings.map(listing => ({
          ...listing,
          images: [],
          image: ''
        }));
        
        saveListings(updatedListings);
        return true;
      } catch (error) {
        console.error("Erreur lors de la suppression de toutes les images:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Toutes les images des logements ont été supprimées");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression des images");
    },
  });

  return { addListing, updateListing, deleteListing, clearAllListingImages };
};
