
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock } from "lucide-react";
import { Reservation } from '@/hooks/useReservations';
import { Badge } from '@/components/ui/badge';

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

  // Fonction pour formater le statut
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Annulée</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-none shadow-xl max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Détails de la réservation</DialogTitle>
          <DialogDescription className="text-base">
            Réservation #{selectedReservation.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Logement</h3>
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded overflow-hidden">
                <img 
                  src={selectedReservation.listing.image || "/placeholder.svg"} 
                  alt={selectedReservation.listing.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div>
                <p className="font-medium">{selectedReservation.listing.title}</p>
                <p className="text-gray-600">{selectedReservation.listing.location}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Client</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">{selectedReservation.guest.name}</p>
                <p className="text-gray-600">{selectedReservation.guest.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Période de séjour</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                <span>Arrivée: {new Date(selectedReservation.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                <span>Départ: {new Date(selectedReservation.checkOut).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Détails</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                <span>{selectedReservation.guestCount} voyageur(s)</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                <span>Réservé le {new Date(selectedReservation.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Statut et paiement</h3>
            <div className="flex items-center space-x-2">
              {getStatusBadge(selectedReservation.status)}
            </div>
          </div>
          <div>
            <p className="text-xl font-bold">
              Prix: {new Intl.NumberFormat('fr-FR').format(selectedReservation.totalPrice * 655.957)} FCFA
            </p>
            <p className="text-sm text-gray-600 text-right">
              ({selectedReservation.totalPrice} €)
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center gap-2 sm:justify-end mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
          <Button 
            variant="default" 
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => {
              handleUpdateStatus(selectedReservation.id, 'confirmed');
              onOpenChange(false);
            }}
          >
            <span className="mr-1">✓</span> Confirmer
          </Button>
          <Button 
            variant="destructive"
            onClick={() => {
              handleUpdateStatus(selectedReservation.id, 'cancelled');
              onOpenChange(false);
            }}
          >
            <span className="mr-1">✗</span> Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDetailsDialog;
