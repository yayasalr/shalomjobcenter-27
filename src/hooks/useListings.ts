
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

// Images de secours fiables pour Lomé
export const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", // Villa moderne
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // Maison élégante
  "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800", // Appartement contemporain
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", // Logement lumineux
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"  // Intérieur moderne
];

// Fonction pour obtenir une image valide à partir d'une URL
const getValidImageUrl = (imageUrl: string, index: number = 0): string => {
  if (!imageUrl) return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  
  if (imageUrl.startsWith('blob:')) {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  }
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('/') && (imageUrl === '/placeholder.svg' || imageUrl.includes('lovable-uploads'))) {
    return imageUrl;
  }
  
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

// Fonction pour normaliser un tableau d'images
const normalizeImages = (images: string[] | undefined): string[] => {
  if (!images || images.length === 0) {
    return [FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)]];
  }
  
  return images.map((img, index) => getValidImageUrl(img, index));
};

// Fonction pour normaliser un objet listing
const normalizeListing = (listing: Listing): Listing => {
  // Normaliser les images
  const normalizedImages = normalizeImages(listing.images);
  
  // Assurer que l'image principale existe et est valide
  const mainImage = getValidImageUrl(listing.image || normalizedImages[0], 0);
  
  // Assurer que chaque listing a une propriété host
  const host = listing.host || { name: "Hôte", image: "/placeholder.svg" };
  
  // Assurer que c'est à Lomé avec un quartier spécifique
  const location = listing.location.includes("Lomé") 
    ? listing.location 
    : `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`;
  
  return {
    ...listing,
    image: mainImage,
    images: normalizedImages,
    host,
    location
  };
};

// Fonction pour charger les listings depuis le localStorage ou utiliser les données mock par défaut
const loadListings = (): Listing[] => {
  const savedListings = localStorage.getItem('listings');
  if (savedListings) {
    const parsedListings = JSON.parse(savedListings);
    // S'assurer que chaque listing a les propriétés requises
    return parsedListings.map(normalizeListing);
  }
  
  // Si aucune donnée n'existe dans le localStorage, adapter les données mock pour Lomé
  const loméListings = MOCK_LISTINGS.map(listing => {
    // Prix adapté au marché de Lomé
    const price = Math.round((listing.price / 2) * 655.957) / 655.957; // Prix en euros divisé par 2 pour être plus réaliste
    
    const baseListing = {
      ...listing,
      location: `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`,
      price
    };
    
    return normalizeListing(baseListing);
  });
  
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
      
      // Créer un ID unique pour le nouveau listing
      const id = Math.random().toString(36).substr(2, 9);
      
      // Préparer le listing avec toutes les propriétés nécessaires
      const listing = normalizeListing({
        ...newListing,
        id,
        rating: 0,
        dates: new Date().toLocaleDateString(),
        host: newListing.host || { name: "Hôte", image: "/placeholder.svg" }
      });
      
      // Assurer que l'image principale est définie
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
        // Normaliser le listing avant de le sauvegarder
        const normalizedListing = normalizeListing(updatedListing);
        
        currentListings[index] = normalizedListing;
        saveListings(currentListings);
        console.log("Listing mis à jour:", normalizedListing);
        return normalizedListing;
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
