
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from 'lucide-react';
import { Reservation } from "@/hooks/reservations";

interface ReservationActionsDropdownProps {
  reservation: Reservation;
  onSelectReservation: (reservation: Reservation) => void;
  handleUpdateStatus: (reservationId: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
}

const ReservationActionsDropdown: React.FC<ReservationActionsDropdownProps> = ({
  reservation,
  onSelectReservation,
  handleUpdateStatus
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onSelectReservation(reservation)}
        >
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleUpdateStatus(reservation.id, 'confirmed')}
          disabled={reservation.status === 'confirmed'}
        >
          Confirmer
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleUpdateStatus(reservation.id, 'pending')}
          disabled={reservation.status === 'pending'}
        >
          Mettre en attente
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleUpdateStatus(reservation.id, 'cancelled')}
          disabled={reservation.status === 'cancelled'}
          className="text-red-600"
        >
          Annuler
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReservationActionsDropdown;
