
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Github, Linkedin, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import useAuth from '@/hooks/useAuth';

interface SocialAccount {
  id: string;
  name: string;
  icon: React.ElementType;
  connected: boolean;
  email: string | null;
}

export const ConnectedAccountsTab: React.FC = () => {
  const { user } = useAuth();
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<SocialAccount | null>(null);
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<string | null>(null);
  
  // Load social accounts from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem(`social_accounts_${user?.id}`);
    if (savedAccounts) {
      setSocialAccounts(JSON.parse(savedAccounts));
    } else {
      // Default accounts if none saved
      const defaultAccounts = [
        { 
          id: 'facebook', 
          name: 'Facebook', 
          icon: Facebook, 
          connected: false, 
          email: null
        },
        { 
          id: 'twitter', 
          name: 'Twitter', 
          icon: Twitter, 
          connected: false, 
          email: null
        },
        { 
          id: 'github', 
          name: 'GitHub', 
          icon: Github, 
          connected: false, 
          email: null
        },
        { 
          id: 'linkedin', 
          name: 'LinkedIn', 
          icon: Linkedin, 
          connected: false, 
          email: null
        },
      ];
      setSocialAccounts(defaultAccounts);
    }
  }, [user?.id]);

  // Save accounts to localStorage when changed
  useEffect(() => {
    if (user?.id && socialAccounts.length > 0) {
      localStorage.setItem(`social_accounts_${user.id}`, JSON.stringify(socialAccounts));
    }
  }, [socialAccounts, user?.id]);

  const handleConnect = (accountId: string) => {
    const account = socialAccounts.find(a => a.id === accountId);
    if (account) {
      setCurrentAccount(account);
      setAccountEmail('');
      setAccountPassword('');
      setShowConnectDialog(true);
    }
  };

  const submitConnect = () => {
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
    
    // Update the account in the state
    const updatedAccounts = socialAccounts.map(account => {
      if (account.id === currentAccount?.id) {
        return {
          ...account,
          connected: true,
          email: accountEmail
        };
      }
      return account;
    });
    
    setSocialAccounts(updatedAccounts);
    setShowConnectDialog(false);
    
    // Log the connection
    logSocialActivity(currentAccount?.id || '', 'connect');
    
    toast.success(`Compte ${currentAccount?.name} connecté avec succès`);
  };

  const initiateDisconnect = (accountId: string) => {
    setAccountToDisconnect(accountId);
    setShowConfirmDisconnect(true);
  };

  const handleDisconnect = () => {
    if (!accountToDisconnect) return;
    
    const updatedAccounts = socialAccounts.map(account => {
      if (account.id === accountToDisconnect) {
        return {
          ...account,
          connected: false,
          email: null
        };
      }
      return account;
    });
    
    setSocialAccounts(updatedAccounts);
    setShowConfirmDisconnect(false);
    setAccountToDisconnect(null);
    
    // Log the disconnection
    logSocialActivity(accountToDisconnect, 'disconnect');
    
    toast.success(`Compte déconnecté`);
  };

  const logSocialActivity = (accountId: string, action: 'connect' | 'disconnect') => {
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push({
      type: `social_account_${action}`,
      userId: user?.id,
      email: user?.email,
      accountType: accountId,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comptes sociaux connectés</CardTitle>
          <CardDescription>Gérez les comptes sociaux connectés à votre profil</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Connecter des comptes sociaux vous permet de vous connecter plus facilement et d'importer vos informations de profil.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            {socialAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <account.icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">{account.name}</div>
                    {account.connected && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {account.email}
                      </div>
                    )}
                  </div>
                </div>
                {account.connected ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => initiateDisconnect(account.id)}
                  >
                    Déconnecter
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleConnect(account.id)}
                  >
                    Connecter
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Avantages des comptes liés</CardTitle>
          <CardDescription>Pourquoi connecter vos comptes sociaux</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Connexion plus rapide avec un seul clic</li>
            <li>Récupération de compte simplifiée</li>
            <li>Importer automatiquement votre photo de profil et vos informations</li>
            <li>Partager facilement vos réservations et expériences</li>
          </ul>
        </CardContent>
      </Card>

      {/* Dialog to connect account */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connecter votre compte {currentAccount?.name}</DialogTitle>
            <DialogDescription>
              Entrez vos identifiants {currentAccount?.name} pour connecter votre compte
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
                placeholder={`votre-email@${currentAccount?.id}.com`}
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
            <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
              Annuler
            </Button>
            <Button onClick={submitConnect}>
              Connecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog to confirm disconnection */}
      <Dialog open={showConfirmDisconnect} onOpenChange={setShowConfirmDisconnect}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la déconnexion</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir déconnecter ce compte social ?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDisconnect(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDisconnect}>
              Déconnecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
