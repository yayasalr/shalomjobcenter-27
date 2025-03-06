
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Github, Linkedin, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const ConnectedAccountsTab: React.FC = () => {
  const socialAccounts = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      connected: true, 
      email: 'user@example.com'
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
      connected: true, 
      email: 'dev@github.com'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: Linkedin, 
      connected: false, 
      email: null
    },
  ];

  const handleConnect = (id: string) => {
    toast.success(`Compte ${id} connecté avec succès`);
  };

  const handleDisconnect = (id: string) => {
    toast.success(`Compte ${id} déconnecté`);
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
                    onClick={() => handleDisconnect(account.id)}
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
    </div>
  );
};
