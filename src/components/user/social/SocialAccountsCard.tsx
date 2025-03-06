
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SocialAccount } from './types';
import { SocialAccountItem } from './SocialAccountItem';

interface SocialAccountsCardProps {
  accounts: SocialAccount[];
  onConnect: (accountId: string) => void;
  onDisconnect: (accountId: string) => void;
}

export const SocialAccountsCard: React.FC<SocialAccountsCardProps> = ({ 
  accounts,
  onConnect,
  onDisconnect
}) => {
  return (
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
          {accounts.map((account) => (
            <SocialAccountItem
              key={account.id}
              account={account}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
