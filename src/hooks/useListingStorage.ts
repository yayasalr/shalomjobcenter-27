
import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from '@/constants/locations';
import { normalizeListing } from '@/utils/listingUtils';
import { MOCK_LISTINGS } from "@/data/mockData";

// Fonction pour charger les listings depuis le localStorage ou utiliser les données mock par défaut
export const loadListings = (): Listing[] => {
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
export const saveListings = (listings: Listing[]) => {
  localStorage.setItem('listings', JSON.stringify(listings));
};

// Fonction pour charger les réservations
export const loadReservations = () => {
  const savedReservations = localStorage.getItem('reservations');
  if (savedReservations) {
    return JSON.parse(savedReservations);
  }
  return [];
};

// Fonction pour sauvegarder les réservations
export const saveReservations = (reservations: any[]) => {
  localStorage.setItem('reservations', JSON.stringify(reservations));
};
