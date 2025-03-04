
import React from 'react';
import { formatDate } from "../../utils/formatUtils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reservation } from "@/hooks/reservations";
import StatusBadge from './StatusBadge';
import ReservationActionsDropdown from './ReservationActionsDropdown';

interface ReservationsDesktopTableProps {
  reservations: Reservation[];
  onSelectReservation: (reservation: Reservation) => void;
  handleUpdateStatus: (reservationId: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
}

const ReservationsDesktopTable: React.FC<ReservationsDesktopTableProps> = ({
  reservations,
  onSelectReservation,
  handleUpdateStatus
}) => {
  return (
    <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Logement</th>
              <th className="px-6 py-3">Période</th>
              <th className="px-6 py-3">Prix</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{reservation.guestName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.guestName}</div>
                      <div className="text-sm text-gray-500">{reservation.guestEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden mr-3">
                      <img
                        src={reservation.listingImage || "/placeholder.svg"}
                        alt={reservation.listingTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {reservation.listingTitle}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {reservation.listingLocation}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {reservation.guests} voyageur{reservation.guests > 1 ? "s" : ""}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round(reservation.totalPrice * 655.957).toLocaleString('fr-FR')} FCFA
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={reservation.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ReservationActionsDropdown 
                    reservation={reservation}
                    onSelectReservation={onSelectReservation}
                    handleUpdateStatus={handleUpdateStatus}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsDesktopTable;
