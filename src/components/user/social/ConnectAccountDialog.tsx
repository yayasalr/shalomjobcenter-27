
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SocialAccount } from './types';

interface ConnectAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: SocialAccount | null;
  onConnect: (email: string, password: string) => void;
}

export const ConnectAccountDialog: React.FC<ConnectAccountDialogProps> = ({
  open,
  onOpenChange,
  account,
  onConnect,
}) => {
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');

  const handleConnect = () => {
    if (!accountEmail || !accountPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    if (!accountEmail.includes('@')) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }
    
    if (accountPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    onConnect(accountEmail, accountPassword);
    // Reset fields after connecting
    setAccountEmail('');
    setAccountPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connecter votre compte {account?.name}</DialogTitle>
          <DialogDescription>
            Entrez vos identifiants {account?.name} pour connecter votre compte
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="social-email" className="text-right">
              Email
            </Label>
            <Input
              id="social-email"
              type="email"
              placeholder={`votre-email@${account?.id}.com`}
              className="col-span-3"
              value={accountEmail}
              onChange={(e) => setAccountEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="social-password" className="text-right">
              Mot de passe
            </Label>
            <Input
              id="social-password"
              type="password"
              className="col-span-3"
              value={accountPassword}
              onChange={(e) => setAccountPassword(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleConnect}>
            Connecter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
