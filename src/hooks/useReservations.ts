
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Reservation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingLocation: string;
  listingImage: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  notes?: string;
}

// Fonction pour charger les réservations depuis le localStorage
const loadReservations = (): Reservation[] => {
  const savedReservations = localStorage.getItem('reservations');
  if (savedReservations) {
    return JSON.parse(savedReservations);
  }
  // Si pas de réservations, retourner un tableau vide
  return [];
};

// Fonction pour sauvegarder les réservations
const saveReservations = (reservations: Reservation[]) => {
  localStorage.setItem('reservations', JSON.stringify(reservations));
};

export const useReservations = () => {
  const queryClient = useQueryClient();

  const { data: reservations = [], isLoading, error } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const currentReservations = loadReservations();
      console.log("Chargement des réservations:", currentReservations);
      return currentReservations;
    },
    staleTime: 0,
    gcTime: 0,
  });

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
    reservations,
    isLoading,
    error,
    addReservation,
    updateReservationStatus
  };
};
