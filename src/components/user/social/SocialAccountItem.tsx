
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { SocialAccount } from './types';

interface SocialAccountItemProps {
  account: SocialAccount;
  onConnect: (accountId: string) => void;
  onDisconnect: (accountId: string) => void;
}

export const SocialAccountItem: React.FC<SocialAccountItemProps> = ({
  account,
  onConnect,
  onDisconnect,
}) => {
  const Icon = account.icon;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-gray-500" />
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
          onClick={() => onDisconnect(account.id)}
        >
          Déconnecter
        </Button>
      ) : (
        <Button 
          size="sm"
          onClick={() => onConnect(account.id)}
        >
          Connecter
        </Button>
      )}
    </div>
  );
};
