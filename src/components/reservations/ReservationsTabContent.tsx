
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Reservation } from '@/hooks/reservations';
import { ReservationCard } from './ReservationCard';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Star, Pencil } from 'lucide-react';

interface ReservationsTabContentProps {
  value: string;
  reservations: Reservation[];
  emptyTitle: string;
  emptyDescription: string;
  onViewDetails: (reservationId: string) => void;
  onCancel?: (reservationId: string) => void;
  onModify?: (reservationId: string) => void;
  showModifyButton?: boolean;
  showReviewButton?: boolean;
}

export const ReservationsTabContent: React.FC<ReservationsTabContentProps> = ({
  value,
  reservations,
  emptyTitle,
  emptyDescription,
  onViewDetails,
  onCancel,
  onModify,
  showModifyButton = false,
  showReviewButton = false
}) => {
  const handleReview = (reservationId: string) => {
    // Navigation vers la page d'avis ou ouverture d'une modale
    console.log('Leave review for', reservationId);
  };

  const handleExport = (reservationId: string) => {
    // Export de la réservation au format iCal
    console.log('Export reservation', reservationId);
  };

  return (
    <TabsContent value={value} className="space-y-6">
      {reservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onViewDetails={() => onViewDetails(reservation.id)}
              onCancel={onCancel ? () => onCancel(reservation.id) : undefined}
              actions={
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(reservation.id);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exporter</span>
                  </Button>
                  
                  {showModifyButton && onModify && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onModify(reservation.id);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Modifier</span>
                    </Button>
                  )}
                  
                  {showReviewButton && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReview(reservation.id);
                      }}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Avis</span>
                    </Button>
                  )}
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </TabsContent>
  );
};
