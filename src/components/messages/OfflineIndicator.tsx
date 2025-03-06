
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Wifi, WifiOff, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
      toast.success('Connexion rétablie');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Connexion perdue. Mode hors ligne activé.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      {!isOnline && (
        <Alert variant="destructive" className="flex items-center">
          <WifiOff className="h-4 w-4 mr-2" />
          <AlertDescription>
            Mode hors ligne. Certaines fonctionnalités peuvent être limitées.
          </AlertDescription>
        </Alert>
      )}
      
      {isOnline && showReconnected && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
          <AlertDescription>
            Connexion rétablie.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
