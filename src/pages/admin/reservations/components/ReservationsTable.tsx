
import React from 'react';
import { Reservation } from "@/hooks/reservations"; // Updated import path
import { formatDate } from "../utils/formatUtils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreHorizontal, Check, X } from 'lucide-react';

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
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
        </div>
        <p className="mt-2 text-gray-500">Chargement des réservations...</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <div className="mb-4 text-gray-400">
          <Clock className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune réservation trouvée</h3>
        <p className="text-gray-500">Il n'y a pas de réservations correspondant à vos critères.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    {reservation.guests} voyageur{reservation.guests > 1 ? 's' : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round(reservation.totalPrice * 655.957).toLocaleString('fr-FR')} FCFA
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    className={`${
                      reservation.status === 'confirmed'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : reservation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    {reservation.status === 'confirmed' ? (
                      <>
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Confirmée
                      </>
                    ) : reservation.status === 'pending' ? (
                      <>
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        En attente
                      </>
                    ) : (
                      <>
                        <X className="mr-1 h-3.5 w-3.5" />
                        Annulée
                      </>
                    )}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsTable;
