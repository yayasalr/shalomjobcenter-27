
import { toast } from "sonner";
import { Listing } from "@/types/listing";

/**
 * Format price in FCFA
 */
export const formatPriceFCFA = (priceEUR: number): string => {
  const priceFCFA = Math.round(priceEUR * 655.957);
  return priceFCFA.toLocaleString("fr-FR");
};

/**
 * Validate reservation dates
 */
export const validateReservationDates = (
  startDate: string, 
  endDate: string
): { isValid: boolean; message?: string } => {
  if (!startDate || !endDate) {
    return { isValid: false, message: "Veuillez sélectionner des dates" };
  }

  // Convert dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, message: "Dates invalides" };
  }

  // Ensure start date is before end date
  if (start >= end) {
    return { 
      isValid: false, 
      message: "La date de départ doit être après la date d'arrivée" 
    };
  }

  return { isValid: true };
};

/**
 * Calculate stay duration in days
 */
export const calculateStayDuration = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0;
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Create reservation object
 */
export const createReservationObject = (
  listing: Listing,
  userId: string,
  userName: string,
  userEmail: string,
  startDate: string,
  endDate: string,
  guestCount: number
) => {
  const diffDays = calculateStayDuration(startDate, endDate);
  
  return {
    listingId: listing.id,
    listingTitle: listing.title || "Logement sans titre",
    listingLocation: listing.location || "Emplacement non spécifié",
    listingImage: listing.image || "/placeholder.svg",
    guestName: userName,
    guestEmail: userEmail,
    checkIn: startDate,
    checkOut: endDate,
    guests: guestCount,
    totalPrice: diffDays * listing.price,
    notes: `Réservation pour ${diffDays} jours à ${formatPriceFCFA(listing.price)} FCFA par jour`,
  };
};
