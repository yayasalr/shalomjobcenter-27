
import { useReservations, Reservation } from '@/hooks/reservations';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useReservationsPage = () => {
  const { 
    reservations, 
    isLoading, 
    updateReservationStatus 
  } = useReservations();
  
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
    // Implémenter la navigation vers les détails de la réservation
    console.log('View details for reservation:', id);
    // Pour l'instant, juste afficher un toast
    toast.info('Détails de la réservation en cours de développement');
  }, []);

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
