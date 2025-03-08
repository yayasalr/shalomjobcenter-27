
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loadReservations, saveReservations } from "../useListingStorage";
import { toast } from "sonner";

/**
 * Hook for reservation-related operations
 */
export const useReservationMutations = () => {
  const queryClient = useQueryClient();

  // Add new reservation
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
    onSuccess: (newReservation) => {
      queryClient.setQueryData(["reservations"], (old: any[] = []) => [...old, newReservation]);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Réservation effectuée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la réservation");
    }
  });

  // Get all reservations
  const getReservations = () => {
    return loadReservations();
  };

  return { addReservation, getReservations };
};
