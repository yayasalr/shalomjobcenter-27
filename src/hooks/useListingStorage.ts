
import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from '@/constants/locations';
import { normalizeListing } from '@/utils/listingUtils';
import { MOCK_LISTINGS } from "@/data/mockData";

// Fonction pour charger les listings depuis le localStorage ou utiliser les données mock par défaut
export const loadListings = (): Listing[] => {
  try {
    const savedListings = localStorage.getItem('listings');
    if (savedListings) {
      console.log("Chargement des listings depuis localStorage");
      
      try {
        const parsedListings = JSON.parse(savedListings);
        
        // Vérification additionnelle que les données sont valides
        if (!Array.isArray(parsedListings)) {
          throw new Error("Les données chargées ne sont pas un tableau");
        }
        
        // Récupérer les listings sans normalisation pour préserver les images d'origine
        return parsedListings.map((listing: Listing) => {
          console.log(`Chargement du listing ${listing.id || 'nouveau'} avec ses images d'origine`);
          
          // Vérification et correction des images
          if (listing.images) {
            console.log(`Images originales du listing ${listing.id} préservées:`, listing.images);
          } else {
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
        throw parseError; // Pour être capturé par le bloc catch extérieur
      }
    }
    
    // Si aucune donnée n'existe dans le localStorage, adapter les données mock pour Lomé
    console.log("Aucun listing trouvé, utilisation des données mock");
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
    
    // Sauvegarder immédiatement dans localStorage
    localStorage.setItem('listings', JSON.stringify(loméListings));
    
    // Sauvegarde de secours horodatée
    const timestamp = Date.now();
    localStorage.setItem(`listings_backup_${timestamp}`, JSON.stringify(loméListings));
    console.log(`Sauvegarde initiale des listings à ${new Date().toISOString()}`);
    
    return loméListings;
  } catch (error) {
    console.error("Erreur lors du chargement des listings:", error);
    
    // En cas d'erreur, utiliser les données mock
    const defaultListings = MOCK_LISTINGS.map(listing => normalizeListing({
      ...listing,
      location: `${LOME_NEIGHBORHOODS[0]}, Lomé, Togo`,
    }));
    
    // Essayer de sauvegarder les données par défaut
    try {
      localStorage.setItem('listings', JSON.stringify(defaultListings));
      // Sauvegarde de secours
      const timestamp = Date.now();
      localStorage.setItem(`listings_backup_emergency_${timestamp}`, JSON.stringify(defaultListings));
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
    
    // Vérifier que les listings ont bien des images préservées
    const verifiedListings = listings.map(listing => {
      // Vérifier les images
      if (!listing.images) {
        console.warn(`Listing ${listing.id} sans tableau d'images, correction...`);
        listing.images = [];
      }
      
      // Vérifier l'image principale
      if (!listing.image) {
        console.warn(`Listing ${listing.id} sans image principale, correction...`);
        if (listing.images.length > 0) {
          listing.image = listing.images[0];
        }
      }
      
      return listing;
    });
    
    // CRITIQUE: Sauvegarder les listings avec GARANTIE de fiabilité
    localStorage.setItem('listings', JSON.stringify(verifiedListings));
    
    // Sauvegardes additionnelles avec timestamp
    const timestamp = Date.now();
    localStorage.setItem(`listings_backup_${timestamp}`, JSON.stringify(verifiedListings));
    
    // Sauvegarde de secours supplémentaire
    localStorage.setItem('listings_last_backup', JSON.stringify(verifiedListings));
    
    // Sauvegarder les images de chaque listing séparément pour plus de sécurité
    verifiedListings.forEach(listing => {
      if (listing.id) {
        const key = `listing_images_${listing.id}_${timestamp}`;
        if (listing.images && listing.images.length > 0) {
          localStorage.setItem(key, JSON.stringify(listing.images));
        }
        if (listing.image) {
          localStorage.setItem(`listing_image_${listing.id}_${timestamp}`, listing.image);
        }
      }
    });
    
    console.log(`Listings sauvegardés avec succès à ${new Date(timestamp).toISOString()}`);
    
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
