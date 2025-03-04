
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Reservation } from "./types";
import { createDemoReservationsIfEmpty } from "./demoData";
import { useReservationMutations } from "./mutations";
import { loadReservations } from "./storage";

export type { Reservation } from "./types";
export { loadReservations, saveReservations } from "./storage";

export const useReservations = () => {
  const queryClient = useQueryClient();
  const { addReservation, updateReservationStatus } = useReservationMutations();

  const { data: reservations = [], isLoading, error, refetch } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      // Créer des réservations de démonstration si nécessaire
      const currentReservations = createDemoReservationsIfEmpty();
      console.log("Chargement des réservations:", currentReservations);
      return currentReservations;
    },
    staleTime: 0, // Toujours recharger au montage
    gcTime: 0, // Ne pas mettre en cache
  });

  return {
    reservations,
    isLoading,
    error,
    addReservation,
    updateReservationStatus,
    refetch
  };
};
