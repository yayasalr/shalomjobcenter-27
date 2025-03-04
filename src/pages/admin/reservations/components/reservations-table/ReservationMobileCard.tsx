
import React from 'react';
import { formatDate } from "../../utils/formatUtils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Mail, Eye, Check, X } from 'lucide-react';
import { Reservation } from "@/hooks/reservations";
import StatusBadge from './StatusBadge';

interface ReservationMobileCardProps {
  reservation: Reservation;
  onSelectReservation: (reservation: Reservation) => void;
  handleUpdateStatus: (reservationId: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
}

const ReservationMobileCard: React.FC<ReservationMobileCardProps> = ({
  reservation,
  onSelectReservation,
  handleUpdateStatus
}) => {
  return (
    <div key={reservation.id} className="bg-white rounded-lg shadow overflow-hidden border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback>{reservation.guestName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{reservation.guestName}</div>
              <div className="text-sm text-gray-500 truncate max-w-[180px]">{reservation.guestEmail}</div>
            </div>
          </div>
          <StatusBadge status={reservation.status} />
        </div>
      </div>
      <div className="p-4 border-b">
        <div className="text-sm font-medium mb-1">{reservation.listingTitle}</div>
        <div className="text-xs text-gray-500 flex items-center mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          {reservation.listingLocation}
        </div>
        <div className="text-sm text-gray-500 flex items-center mb-2">
          <Mail className="h-4 w-4 mr-1 text-gray-400" />
          {reservation.guestEmail}
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
        </div>
      </div>
      <div className="p-3 bg-gray-50 flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSelectReservation(reservation)}
          className="text-xs h-8"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          Détails
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-green-600 h-8"
            disabled={reservation.status === 'confirmed'}
            onClick={() => handleUpdateStatus(reservation.id, 'confirmed')}
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Confirmer
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-red-600 h-8"
            disabled={reservation.status === 'cancelled'}
            onClick={() => handleUpdateStatus(reservation.id, 'cancelled')}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReservationMobileCard;
