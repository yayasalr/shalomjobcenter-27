
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface DisconnectAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisconnect: () => void;
}

export const DisconnectAccountDialog: React.FC<DisconnectAccountDialogProps> = ({
  open,
  onOpenChange,
  onDisconnect,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmer la déconnexion</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir déconnecter ce compte social ?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onDisconnect}>
            Déconnecter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
