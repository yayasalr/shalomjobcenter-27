
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Reservation } from '@/hooks/reservations';
import { Calendar, MoreHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { downloadICalFile, addToGoogleCalendar } from '../utils/calendarUtils';

interface CardActionsProps {
  status: Reservation['status'];
  reservation?: Reservation;
  onViewDetails: (e?: React.MouseEvent) => void;
  onCancel?: (e?: React.MouseEvent) => void;
}

export const CardActions = ({ 
  status, 
  reservation,
  onViewDetails,
  onCancel 
}: CardActionsProps) => {
  const { t } = useLanguage();
  
  const handleAddToCalendar = (e: React.MouseEvent, type: 'ical' | 'google') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!reservation) return;
    
    if (type === 'ical') {
      downloadICalFile(reservation);
    } else {
      addToGoogleCalendar(reservation);
    }
  };
  
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="w-full" onClick={onViewDetails}>
        {t('details') || 'Détails'}
      </Button>
      
      {reservation && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={(e) => handleAddToCalendar(e, 'ical')}
              >
                {t('add_to_calendar') || 'Ajouter au calendrier'}
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={(e) => handleAddToCalendar(e, 'google')}
              >
                {t('add_to_google') || 'Ajouter à Google'}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      {status !== 'cancelled' && onCancel && (
        <Button variant="destructive" className="w-full" onClick={onCancel}>
          {t('cancel') || 'Annuler'}
        </Button>
      )}
    </div>
  );
};
