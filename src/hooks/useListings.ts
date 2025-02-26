
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { MOCK_LISTINGS } from "@/data/mockData";

// Liste des quartiers de Lomé pour les nouvelles annonces
export const LOME_NEIGHBORHOODS = [
  "Tokoin", "Bè", "Adidogomé", "Agoè", "Kodjoviakopé", 
  "Nyékonakpoè", "Hédzranawoé", "Baguida", "Agbalépédogan", 
  "Akodésséwa", "Gbényédji", "Ablogamé", "Abobo", "Aflao"
];

// Fonction pour charger les listings depuis le localStorage ou utiliser les données mock par défaut
const loadListings = (): Listing[] => {
  const savedListings = localStorage.getItem('listings');
  if (savedListings) {
    const parsedListings = JSON.parse(savedListings);
    // S'assurer que chaque listing a une propriété host et localisation à Lomé
    return parsedListings.map((listing: Listing) => {
      // Assurer que c'est à Lomé
      const location = listing.location.includes("Lomé") 
        ? listing.location 
        : `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`;
      
      return {
        ...listing,
        location,
        host: listing.host || { name: "Hôte", image: "/placeholder.svg" }
      };
    });
  }
  
  // Si aucune donnée n'existe dans le localStorage, adapter les données mock pour Lomé
  const loméListings = MOCK_LISTINGS.map(listing => ({
    ...listing,
    location: `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`,
    // Prix adapté au marché de Lomé (conversion approximative en considérant le marché local)
    price: Math.round((listing.price / 2) * 655.957) / 655.957, // Prix en euros divisé par 2 pour être plus réaliste
  }));
  
  localStorage.setItem('listings', JSON.stringify(loméListings));
  return loméListings;
};

// Fonction pour sauvegarder les listings dans le localStorage
const saveListings = (listings: Listing[]) => {
  localStorage.setItem('listings', JSON.stringify(listings));
};

// Fonction pour charger les réservations
const loadReservations = () => {
  const savedReservations = localStorage.getItem('reservations');
  if (savedReservations) {
    return JSON.parse(savedReservations);
  }
  return [];
};

// Fonction pour sauvegarder les réservations
const saveReservations = (reservations: any[]) => {
  localStorage.setItem('reservations', JSON.stringify(reservations));
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
  });

  const addListing = useMutation({
    mutationFn: async (newListing: Omit<Listing, "id">) => {
      const currentListings = loadListings();
      const listing = {
        ...newListing,
        id: Math.random().toString(36).substr(2, 9),
        rating: 0,
        dates: new Date().toLocaleDateString(),
        // S'assurer que chaque nouveau listing a un hôte
        host: newListing.host || { name: "Hôte", image: "/placeholder.svg" }
      };
      
      // Assurez-vous que l'image principale est définie
      if (listing.images && listing.images.length > 0 && !listing.image) {
        listing.image = listing.images[0];
      }
      
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
        // Assurez-vous que l'image principale est définie
        if (updatedListing.images && updatedListing.images.length > 0 && !updatedListing.image) {
          updatedListing.image = updatedListing.images[0];
        }
        
        // S'assurer que le listing mis à jour a un hôte
        updatedListing.host = updatedListing.host || { name: "Hôte", image: "/placeholder.svg" };
        
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
    onSuccess: () => {
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
