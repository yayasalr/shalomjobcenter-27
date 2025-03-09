
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useLocalStorage from '@/hooks/useLocalStorage';

interface NotificationsCardProps {
  onPreferenceChange: (key: string, value: any) => void;
}

export const NotificationsCard: React.FC<NotificationsCardProps> = ({ onPreferenceChange }) => {
  const { getItem, setItem } = useLocalStorage();
  
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    return getItem('user_notification_preferences', {
      email: true,
      push: true,
      reservation: true,
      promotional: false
    });
  });
  
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationPrefs(prev => {
      const updated = { ...prev, [key]: value };
      setItem('user_notification_preferences', updated);
      onPreferenceChange('notifications', updated);
      return updated;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Gérez vos préférences de notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Notifications par email</div>
              <div className="text-sm text-muted-foreground">Recevoir des mises à jour par email</div>
            </div>
            <Switch 
              checked={notificationPrefs.email} 
              onCheckedChange={(checked) => handleNotificationChange('email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Notifications push</div>
              <div className="text-sm text-muted-foreground">Recevoir des notifications sur votre appareil</div>
            </div>
            <Switch 
              checked={notificationPrefs.push} 
              onCheckedChange={(checked) => handleNotificationChange('push', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Notifications de réservation</div>
              <div className="text-sm text-muted-foreground">Mises à jour concernant vos réservations</div>
            </div>
            <Switch 
              checked={notificationPrefs.reservation} 
              onCheckedChange={(checked) => handleNotificationChange('reservation', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Notifications promotionnelles</div>
              <div className="text-sm text-muted-foreground">Offres spéciales et réductions</div>
            </div>
            <Switch 
              checked={notificationPrefs.promotional} 
              onCheckedChange={(checked) => handleNotificationChange('promotional', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
