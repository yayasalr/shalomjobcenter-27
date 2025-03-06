
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  NotificationTabs, 
  NotificationHeader,
  NotificationFooter
} from '@/components/notifications';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Notifications = () => {
  const { 
    notifications, 
    groupedNotifications,
    unreadCount, 
    isConnected,
    filterType,
    setFilterType,
    markAllAsRead,
    markAsRead,
    markAsUnread,
    saveNotification,
    unsaveNotification,
    deleteNotification
  } = useNotifications();
  
  const [showConnectionAlert, setShowConnectionAlert] = useState(false);
  
  // Afficher l'alerte de connexion lorsque l'état de connexion change
  useEffect(() => {
    if (!isConnected) {
      setShowConnectionAlert(true);
    } else {
      // Masquer l'alerte après un délai si la connexion est rétablie
      const timer = setTimeout(() => {
        setShowConnectionAlert(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <NotificationHeader 
          unreadCount={unreadCount} 
          onMarkAllAsRead={markAllAsRead}
          filterType={filterType || undefined}
          onFilterChange={setFilterType}
        />
        
        {showConnectionAlert && (
          <Alert className={`mb-6 ${isConnected ? 'bg-green-50' : 'bg-red-50'}`}>
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle>
              {isConnected ? 'Connexion rétablie' : 'Problème de connexion'}
            </AlertTitle>
            <AlertDescription>
              {isConnected 
                ? 'Vous recevez à nouveau les notifications en temps réel.' 
                : 'Les notifications en temps réel sont temporairement indisponibles. Tentative de reconnexion...'}
            </AlertDescription>
          </Alert>
        )}
        
        <TooltipProvider>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Centre de notifications</CardTitle>
                  <CardDescription>Restez informé de toutes vos activités récentes</CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isConnected 
                      ? 'Connecté aux notifications en temps réel' 
                      : 'Déconnecté des notifications en temps réel'}
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            
            <NotificationTabs 
              notifications={notifications}
              groupedNotifications={groupedNotifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAsUnread={markAsUnread}
              onSave={saveNotification}
              onUnsave={unsaveNotification}
              onDelete={deleteNotification}
            />
            
            <CardFooter>
              <NotificationFooter />
            </CardFooter>
          </Card>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Notifications;
