
import { useQuery } from "@tanstack/react-query";
import { Reservation } from "./types";
import { createDemoReservationsIfEmpty } from "./demoData";
import { useReservationMutations } from "./mutations";

export type { Reservation } from "./types";
export { loadReservations, saveReservations } from "./storage";

export const useReservations = () => {
  const { addReservation, updateReservationStatus } = useReservationMutations();

  const { data: reservations = [], isLoading, error } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      // Créer des réservations de démonstration si nécessaire
      const currentReservations = createDemoReservationsIfEmpty();
      console.log("Chargement des réservations:", currentReservations);
      return currentReservations;
    },
    staleTime: 0,
    gcTime: 0,
  });

  return {
    reservations,
    isLoading,
    error,
    addReservation,
    updateReservationStatus
  };
};
