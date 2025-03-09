
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Reservation } from '@/hooks/reservations';

interface ReservationStatusProps {
  status: Reservation['status'];
}

export const ReservationStatus = ({ status }: ReservationStatusProps) => {
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

  return (
    <Badge variant={getBadgeVariant(status) as any}>
      {getStatusText(status)}
    </Badge>
  );
};
