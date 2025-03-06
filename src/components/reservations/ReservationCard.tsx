
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Reservation } from '@/hooks/reservations';
import { toast } from 'sonner';
import { ShareDialog } from '@/components/social/ShareDialog';
import { 
  ReservationStatus, 
  ReservationDetails, 
  SocialActions, 
  CardActions 
} from './card';
import { useSocialInteractions } from '@/hooks/useSocialInteractions';

interface ReservationCardProps {
  reservation: Reservation;
  onViewDetails?: (id: string) => void;
  onCancel?: (id: string) => void;
  actions?: React.ReactNode;
}

export const ReservationCard = ({ 
  reservation, 
  onViewDetails,
  onCancel,
  actions
}: ReservationCardProps) => {
  const { incrementShares } = useSocialInteractions();
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(reservation.id);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCancel) {
      onCancel(reservation.id);
    }
  };
  
  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleViewDetails();
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareDialog(true);
  };
  
  const handleShareComplete = (platform: string) => {
    incrementShares.mutate({
      type: 'listing',
      itemId: reservation.listingId
    });
    toast.success(`Partagé sur ${platform}`);
    setShowShareDialog(false);
  };
  
  // URL pour le partage
  const shareUrl = `${window.location.origin}/logement/${reservation.listingId}`;

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={reservation.listingImage}
          alt={reservation.listingTitle}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
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
          <ReservationStatus status={reservation.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <ReservationDetails reservation={reservation} />
        
        <SocialActions 
          listingId={reservation.listingId}
          onComment={handleComment}
          onShare={handleShare}
        />
        
        {/* Render custom actions if provided */}
        {actions}
      </CardContent>
      <CardFooter className="gap-2">
        <CardActions 
          status={reservation.status} 
          reservation={reservation}
          onViewDetails={handleViewDetails}
          onCancel={onCancel ? handleCancel : undefined}
        />
      </CardFooter>
      
      {/* Modal de partage */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        title={reservation.listingTitle}
        url={shareUrl}
        onShare={handleShareComplete}
      />
    </Card>
  );
};
