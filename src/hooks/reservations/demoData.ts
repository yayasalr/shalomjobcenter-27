
import { Reservation } from "./types";
import { loadReservations, saveReservations } from "./storage";

// Fonction pour créer des réservations de démonstration si aucune n'existe
export const createDemoReservationsIfEmpty = (): Reservation[] => {
  const currentReservations = loadReservations();
  if (currentReservations.length === 0) {
    const demoReservations: Reservation[] = [];
    saveReservations(demoReservations);
    return demoReservations;
  }
  return currentReservations;
};
