
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
    try {
      const parsed = JSON.parse(savedReservations);
      // Vérifier que chaque réservation a toutes les propriétés requises
      return parsed.map((reservation: any) => {
        // S'assurer que chaque réservation a une image
        if (!reservation.listingImage) {
          reservation.listingImage = "/placeholder.svg";
        }
        // S'assurer des autres champs nécessaires
        return {
          id: reservation.id || Math.random().toString(36).substr(2, 9),
          listingId: reservation.listingId || "",
          listingTitle: reservation.listingTitle || "Logement sans titre",
          listingLocation: reservation.listingLocation || "Emplacement non spécifié",
          listingImage: reservation.listingImage,
          guestName: reservation.guestName || "Invité",
          guestEmail: reservation.guestEmail || "email@exemple.com",
          checkIn: reservation.checkIn || new Date().toISOString(),
          checkOut: reservation.checkOut || new Date(Date.now() + 86400000).toISOString(),
          guests: reservation.guests || 1,
          totalPrice: reservation.totalPrice || 0,
          status: reservation.status || 'pending',
          createdAt: reservation.createdAt || new Date().toISOString(),
          notes: reservation.notes
        };
      });
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      return [];
    }
  }
  // Si pas de réservations, retourner un tableau vide
  return [];
};

// Fonction pour sauvegarder les réservations
const saveReservations = (reservations: Reservation[]) => {
  localStorage.setItem('reservations', JSON.stringify(reservations));
};

// Fonction pour créer des réservations de démonstration si aucune n'existe
const createDemoReservationsIfEmpty = () => {
  const currentReservations = loadReservations();
  if (currentReservations.length === 0) {
    const demoReservations: Reservation[] = [
      {
        id: "demo1",
        listingId: "listing1",
        listingTitle: "Villa de luxe avec piscine",
        listingLocation: "Dakar, Sénégal",
        listingImage: "/placeholder.svg",
        guestName: "Sophie Martin",
        guestEmail: "sophie.martin@example.com",
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 5 * 86400000).toISOString(),
        guests: 3,
        totalPrice: 1500,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
      },
      {
        id: "demo2",
        listingId: "listing2",
        listingTitle: "Appartement au centre-ville",
        listingLocation: "Abidjan, Côte d'Ivoire",
        listingImage: "/placeholder.svg",
        guestName: "Thomas Dubois",
        guestEmail: "thomas.dubois@example.com",
        checkIn: new Date(Date.now() + 15 * 86400000).toISOString(),
        checkOut: new Date(Date.now() + 22 * 86400000).toISOString(),
        guests: 2,
        totalPrice: 800,
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: "demo3",
        listingId: "listing3",
        listingTitle: "Maison traditionnelle",
        listingLocation: "Cotonou, Bénin",
        listingImage: "/placeholder.svg",
        guestName: "Marie Koné",
        guestEmail: "marie.kone@example.com",
        checkIn: new Date(Date.now() - 8 * 86400000).toISOString(),
        checkOut: new Date(Date.now() - 2 * 86400000).toISOString(),
        guests: 4,
        totalPrice: 600,
        status: 'cancelled',
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        notes: "Annulation pour problème personnel."
      }
    ];
    saveReservations(demoReservations);
    return demoReservations;
  }
  return currentReservations;
};

export const useReservations = () => {
  const queryClient = useQueryClient();

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
