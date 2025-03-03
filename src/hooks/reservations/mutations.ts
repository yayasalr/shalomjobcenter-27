
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Reservation } from "./types";
import { loadReservations, saveReservations } from "./storage";

export const useReservationMutations = () => {
  const queryClient = useQueryClient();

  const addReservation = useMutation({
    mutationFn: async (newReservation: Omit<Reservation, "id" | "createdAt" | "status">) => {
      const currentReservations = loadReservations();
      const reservation = {
        ...newReservation,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        status: 'pending' as const
      };
      
      currentReservations.push(reservation);
      saveReservations(currentReservations);
      console.log("Nouvelle réservation ajoutée:", reservation);
      return reservation;
    },
    onSuccess: (newReservation) => {
      queryClient.setQueryData(["reservations"], (old: Reservation[] = []) => [...old, newReservation]);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Réservation ajoutée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de la réservation");
    },
  });

  const updateReservationStatus = useMutation({
    mutationFn: async ({ reservationId, status }: { reservationId: string; status: 'confirmed' | 'pending' | 'cancelled' }) => {
      const currentReservations = loadReservations();
      const index = currentReservations.findIndex(reservation => reservation.id === reservationId);
      
      if (index !== -1) {
        currentReservations[index].status = status;
        saveReservations(currentReservations);
        console.log("Statut de réservation mis à jour:", { reservationId, status });
      }
      return { reservationId, status };
    },
    onSuccess: ({ reservationId, status }) => {
      queryClient.setQueryData(["reservations"], (old: Reservation[] = []) =>
        old.map((reservation) =>
          reservation.id === reservationId ? { ...reservation, status } : reservation
        )
      );
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      
      const statusMessages = {
        confirmed: "Réservation confirmée",
        pending: "Réservation mise en attente",
        cancelled: "Réservation annulée"
      };
      
      toast.success(statusMessages[status]);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut de la réservation");
    },
  });

  return {
    addReservation,
    updateReservationStatus
  };
};
