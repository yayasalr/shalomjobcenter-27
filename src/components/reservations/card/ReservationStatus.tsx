
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Reservation } from '@/hooks/reservations';
import { useLanguage } from '@/hooks/language';

interface ReservationStatusProps {
  status: Reservation['status'];
}

export const ReservationStatus = ({ status }: ReservationStatusProps) => {
  const { t } = useLanguage();
  
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
        return t('confirmed') || 'Confirmée';
      case 'pending':
        return t('pending') || 'En attente';
      case 'cancelled':
        return t('cancelled') || 'Annulée';
      default:
        return t('unknown') || 'Inconnu';
    }
  };

  return (
    <Badge variant={getBadgeVariant(status) as any}>
      {getStatusText(status)}
    </Badge>
  );
};
