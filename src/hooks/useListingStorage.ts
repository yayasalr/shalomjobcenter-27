import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from '@/constants/locations';
import { normalizeListing } from '@/utils/listingUtils';
import { MOCK_LISTINGS } from "@/data/mockData";

// Fonction pour charger les listings depuis le localStorage ou utiliser les données mock par défaut
export const loadListings = (): Listing[] => {
  try {
    // Essayer de charger depuis différentes sauvegardes
    const savedListings = localStorage.getItem('listings');
    const backupListings = localStorage.getItem('listings_last_backup');
    
    if (savedListings) {
      console.log("Chargement des listings depuis localStorage");
      
      try {
        const parsedListings = JSON.parse(savedListings);
        
        // Vérification que les données sont valides
        if (!Array.isArray(parsedListings)) {
          throw new Error("Les données chargées ne sont pas un tableau");
        }
        
        // Récupérer les listings en préservant les images d'origine
        return parsedListings.map((listing: Listing) => {
          console.log(`Chargement du listing ${listing.id || 'nouveau'} avec ses images d'origine`);
          
          // S'assurer que chaque listing a un tableau d'images, même vide
          if (!listing.images) {
            listing.images = [];
          }
          
          // Création d'une copie sécurisée du listing
          return {
            ...listing,
            images: listing.images ? [...listing.images] : [],
            image: listing.image || ''
          };
        });
      } catch (parseError) {
        console.error("Erreur lors de l'analyse des listings:", parseError);
        
        // Essayer d'utiliser la sauvegarde
        if (backupListings) {
          try {
            console.log("Tentative de restauration depuis la sauvegarde");
            const parsedBackup = JSON.parse(backupListings);
            return parsedBackup;
          } catch (backupError) {
            console.error("Erreur avec la sauvegarde:", backupError);
            throw backupError;
          }
        }
        throw parseError;
      }
    }
    
    // Si aucune donnée n'existe, utiliser les données mock
    console.log("Aucun listing trouvé, utilisation des données mock");
    const loméListings = MOCK_LISTINGS.map(listing => {
      // Prix adapté au marché de Lomé
      const price = Math.round((listing.price / 2) * 655.957) / 655.957;
      
      const baseListing = {
        ...listing,
        location: `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`,
        price
      };
      
      return normalizeListing(baseListing);
    });
    
    // Sauvegarder les données mock
    localStorage.setItem('listings', JSON.stringify(loméListings));
    localStorage.setItem('listings_last_backup', JSON.stringify(loméListings));
    
    return loméListings;
  } catch (error) {
    console.error("Erreur lors du chargement des listings:", error);
    
    // En cas d'erreur, utiliser les données mock
    const defaultListings = MOCK_LISTINGS.map(listing => normalizeListing({
      ...listing,
      location: `${LOME_NEIGHBORHOODS[0]}, Lomé, Togo`,
    }));
    
    // Tenter de sauvegarder
    try {
      localStorage.setItem('listings', JSON.stringify(defaultListings));
      localStorage.setItem('listings_last_backup', JSON.stringify(defaultListings));
    } catch (storageError) {
      console.error("Impossible de sauvegarder les listings par défaut:", storageError);
    }
    
    return defaultListings;
  }
};

// Fonction pour sauvegarder les listings dans le localStorage
export const saveListings = (listings: Listing[]) => {
  try {
    console.log(`Sauvegarde de ${listings.length} listings dans localStorage`);
    
    // Vérifier que les listings ont des images bien définies
    const verifiedListings = listings.map(listing => {
      if (!listing.images) {
        console.warn(`Listing ${listing.id} sans tableau d'images, correction...`);
        listing.images = [];
      }
      
      return {
        ...listing,
        images: listing.images || [],
        image: listing.image || (listing.images && listing.images.length > 0 ? listing.images[0] : '')
      };
    });
    
    // Sauvegarder les listings
    localStorage.setItem('listings', JSON.stringify(verifiedListings));
    localStorage.setItem('listings_last_backup', JSON.stringify(verifiedListings));
    
    // Sauvegarde individuelle des images
    const timestamp = Date.now();
    verifiedListings.forEach(listing => {
      if (listing.id && listing.images && listing.images.length > 0) {
        localStorage.setItem(`listing_images_${listing.id}_${timestamp}`, JSON.stringify(listing.images));
      }
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des listings:", error);
    return false;
  }
};

// Fonction pour charger les réservations
export const loadReservations = () => {
  try {
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      return JSON.parse(savedReservations);
    }
    return [];
  } catch (error) {
    console.error("Erreur lors du chargement des réservations:", error);
    return [];
  }
};

// Fonction pour sauvegarder les réservations
export const saveReservations = (reservations: any[]) => {
  try {
    localStorage.setItem('reservations', JSON.stringify(reservations));
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des réservations:", error);
    return false;
  }
};
