
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

export const DevicesSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-gray-500" />
          Appareils connectés
        </CardTitle>
        <CardDescription>Gérez les appareils connectés à votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <Smartphone className="h-6 w-6 text-gray-400" />
            <div className="flex-1">
              <div className="font-medium">Cet appareil</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {navigator.userAgent.indexOf('iPhone') > -1 ? 'iPhone' : 
                 navigator.userAgent.indexOf('Android') > -1 ? 'Android' : 
                 'Ordinateur'} • Connecté maintenant
              </div>
            </div>
            <Button variant="outline" size="sm">Déconnecter</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
