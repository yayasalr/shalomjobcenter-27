
import React from 'react';
import { Reservation } from "@/hooks/reservations";
import ReservationMobileCard from './ReservationMobileCard';

interface ReservationsMobileListProps {
  reservations: Reservation[];
  onSelectReservation: (reservation: Reservation) => void;
  handleUpdateStatus: (reservationId: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
}

const ReservationsMobileList: React.FC<ReservationsMobileListProps> = ({
  reservations,
  onSelectReservation,
  handleUpdateStatus
}) => {
  return (
    <div className="space-y-4 lg:hidden">
      {reservations.map((reservation) => (
        <ReservationMobileCard
          key={reservation.id}
          reservation={reservation}
          onSelectReservation={onSelectReservation}
          handleUpdateStatus={handleUpdateStatus}
        />
      ))}
    </div>
  );
};

export default ReservationsMobileList;
