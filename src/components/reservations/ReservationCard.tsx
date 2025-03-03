
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reservation } from '@/hooks/reservations';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface ReservationCardProps {
  reservation: Reservation;
  onViewDetails?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const ReservationCard = ({ 
  reservation, 
  onViewDetails,
  onCancel 
}: ReservationCardProps) => {
  const getBadgeVariant = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Inconnu';
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(reservation.id);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(reservation.id);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={reservation.listingImage}
          alt={reservation.listingTitle}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{reservation.listingTitle}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {reservation.listingLocation}
            </CardDescription>
          </div>
          <Badge variant={getBadgeVariant(reservation.status) as any}>
            {getStatusText(reservation.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-500">Arrivée:</span>
            </div>
            <span className="font-medium">{new Date(reservation.checkIn).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-500">Départ:</span>
            </div>
            <span className="font-medium">{new Date(reservation.checkOut).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-500">Voyageurs:</span>
            </div>
            <span className="font-medium">{reservation.guests}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-500">Réservé le:</span>
            </div>
            <span className="font-medium">{new Date(reservation.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-semibold">Total</span>
            <span className="font-bold">{reservation.totalPrice.toLocaleString()} €</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="w-full" onClick={handleViewDetails}>Détails</Button>
        {reservation.status === 'pending' && (
          <Button variant="destructive" className="w-full" onClick={handleCancel}>Annuler</Button>
        )}
      </CardFooter>
    </Card>
  );
};
