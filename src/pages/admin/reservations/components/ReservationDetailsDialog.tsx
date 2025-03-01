
import React from 'react';
import { Reservation } from "@/hooks/useReservations";
import { formatDate } from "../utils/formatUtils";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, X, User, Clock } from 'lucide-react';

interface ReservationDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedReservation: Reservation | null;
  handleUpdateStatus: (reservationId: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
}

const ReservationDetailsDialog: React.FC<ReservationDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedReservation,
  handleUpdateStatus
}) => {
  if (!selectedReservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la réservation</DialogTitle>
          <DialogDescription>
            Réservation #{selectedReservation.id.substring(0, 8)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Logement</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden mr-3">
                  <img
                    src={selectedReservation.listingImage || "/placeholder.svg"}
                    alt={selectedReservation.listingTitle}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-sm">
                  <div className="font-medium">{selectedReservation.listingTitle}</div>
                  <div className="text-gray-500">{selectedReservation.listingLocation}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Client</h3>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback>{selectedReservation.guestName[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{selectedReservation.guestName}</div>
                  <div className="text-gray-500">{selectedReservation.guestEmail}</div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Période de séjour</h3>
              <div className="text-sm">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Arrivée: {formatDate(selectedReservation.checkIn)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Départ: {formatDate(selectedReservation.checkOut)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Détails</h3>
              <div className="text-sm">
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{selectedReservation.guests} voyageur{selectedReservation.guests > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Réservé le {formatDate(selectedReservation.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-1">Statut et paiement</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="text-sm">
                <Badge
                  className={`${
                    selectedReservation.status === 'confirmed'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : selectedReservation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}
                >
                  {selectedReservation.status === 'confirmed' ? (
                    <>
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Confirmée
                    </>
                  ) : selectedReservation.status === 'pending' ? (
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
              </div>
              
              <div className="text-sm">
                <div className="font-medium">
                  Prix: {Math.round(selectedReservation.totalPrice * 655.957).toLocaleString('fr-FR')} FCFA
                </div>
              </div>
            </div>
          </div>
          
          {selectedReservation.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-1">Notes</h3>
                <div className="text-sm bg-gray-50 p-3 rounded-md">{selectedReservation.notes}</div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
            
            <div className="space-x-2">
              {selectedReservation.status !== 'confirmed' && (
                <Button
                  onClick={() => {
                    handleUpdateStatus(selectedReservation.id, 'confirmed');
                    onOpenChange(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Confirmer
                </Button>
              )}
              
              {selectedReservation.status !== 'cancelled' && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleUpdateStatus(selectedReservation.id, 'cancelled');
                    onOpenChange(false);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDetailsDialog;
