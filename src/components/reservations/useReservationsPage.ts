
import { useReservations, Reservation } from '@/hooks/reservations';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useReservationsPage = () => {
  const navigate = useNavigate();
  const { 
    reservations, 
    isLoading, 
    updateReservationStatus,
    refetch
  } = useReservations();
  
  // Rafraîchir les réservations au chargement de la page
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  const upcoming = reservations.filter(r => 
    r.status !== 'cancelled' && new Date(r.checkIn) >= new Date()
  );
  
  const past = reservations.filter(r => 
    new Date(r.checkOut) < new Date()
  );
  
  const cancelled = reservations.filter(r => 
    r.status === 'cancelled'
  );

  const handleViewDetails = useCallback((id: string) => {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      // Afficher un toast avec les détails de base
      toast.info(`Détails de la réservation: ${reservation.listingTitle}`, {
        description: `Du ${new Date(reservation.checkIn).toLocaleDateString()} au ${new Date(reservation.checkOut).toLocaleDateString()}`,
        duration: 5000
      });
      
      // Naviguer vers la page du logement en utilisant le bon chemin
      if (reservation.listingId) {
        navigate(`/logement/${reservation.listingId}`);
      }
    }
  }, [reservations, navigate]);

  const handleCancelReservation = useCallback((id: string) => {
    updateReservationStatus.mutate({ 
      reservationId: id, 
      status: 'cancelled' 
    });
  }, [updateReservationStatus]);

  return {
    isLoading,
    upcoming,
    past,
    cancelled,
    handleViewDetails,
    handleCancelReservation
  };
};
