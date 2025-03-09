
import React from 'react';
import { Button } from '@/components/ui/button';
import { Reservation } from '@/hooks/reservations';
import { Calendar, MoreHorizontal, Download, FileText } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { downloadICalFile, addToGoogleCalendar } from '../utils/calendarUtils';
import { downloadReservationPDF } from '../utils/pdfUtils';

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
  
  const handleExportPDF = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!reservation) return;
    
    downloadReservationPDF(reservation);
  };
  
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="w-full" onClick={onViewDetails}>
        Détails
      </Button>
      
      {reservation && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Enregistrer en PDF
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={(e) => handleAddToCalendar(e, 'ical')}>
              <Calendar className="mr-2 h-4 w-4" />
              Ajouter au calendrier
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={(e) => handleAddToCalendar(e, 'google')}>
              <Calendar className="mr-2 h-4 w-4" />
              Ajouter à Google
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {status !== 'cancelled' && onCancel && (
        <Button variant="destructive" className="w-full" onClick={onCancel}>
          Annuler
        </Button>
      )}
    </div>
  );
};
