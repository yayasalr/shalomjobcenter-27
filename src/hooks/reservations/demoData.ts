
import { Reservation } from "./types";
import { loadReservations, saveReservations } from "./storage";

// Fonction pour vérifier si des réservations existent déjà
export const createEmptyReservationsIfNeeded = (): Reservation[] => {
  const currentReservations = loadReservations();
  if (currentReservations.length === 0) {
    // Retourner simplement un tableau vide au lieu de créer des exemples
    const emptyReservations: Reservation[] = [];
    saveReservations(emptyReservations);
    return emptyReservations;
  }
  return currentReservations;
};

// Fonction pour purger toutes les réservations (utile pour le nettoyage)
export const purgeAllReservations = (): void => {
  saveReservations([]);
  console.log("Toutes les réservations ont été supprimées");
};
