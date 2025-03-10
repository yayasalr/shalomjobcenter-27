
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { loadReservations, saveReservations } from "../../useListingStorage";

/**
 * Hook pour ajouter une nouvelle réservation
 */
export const useAddReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
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
};
