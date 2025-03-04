
import React, { useEffect } from 'react';
import { Reservation } from "@/hooks/reservations";
import { 
  ReservationsDesktopTable, 
  ReservationsMobileList, 
  EmptyState, 
  LoadingState 
} from './reservations-table';

interface ReservationsTableProps {
  reservations: Reservation[];
  handleUpdateStatus: (reservationId: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
  onSelectReservation: (reservation: Reservation) => void;
  isLoading: boolean;
}

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  reservations,
  handleUpdateStatus,
  onSelectReservation,
  isLoading
}) => {
  useEffect(() => {
    console.log("Reservations table received data:", reservations);
  }, [reservations]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!reservations || reservations.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <ReservationsMobileList 
        reservations={reservations} 
        handleUpdateStatus={handleUpdateStatus} 
        onSelectReservation={onSelectReservation} 
      />
      <ReservationsDesktopTable 
        reservations={reservations} 
        handleUpdateStatus={handleUpdateStatus} 
        onSelectReservation={onSelectReservation} 
      />
    </>
  );
};

export default ReservationsTable;
