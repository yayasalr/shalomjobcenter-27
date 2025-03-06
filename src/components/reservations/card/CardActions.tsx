
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Reservation } from '@/hooks/reservations';

interface CardActionsProps {
  status: Reservation['status'];
  onViewDetails: () => void;
  onCancel?: () => void;
}

export const CardActions = ({ 
  status, 
  onViewDetails,
  onCancel 
}: CardActionsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="w-full" onClick={onViewDetails}>
        {t('details') || 'Détails'}
      </Button>
      {status !== 'cancelled' && onCancel && (
        <Button variant="destructive" className="w-full" onClick={onCancel}>
          {t('cancel') || 'Annuler'}
        </Button>
      )}
    </div>
  );
};
