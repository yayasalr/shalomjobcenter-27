
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  NotificationTabs, 
  NotificationHeader,
  NotificationFooter
} from '@/components/notifications';

const Notifications = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <NotificationHeader 
          unreadCount={unreadCount} 
          onMarkAllAsRead={markAllAsRead} 
        />
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Centre de notifications</CardTitle>
            <CardDescription>Restez informé de toutes vos activités récentes</CardDescription>
          </CardHeader>
          
          <NotificationTabs 
            notifications={notifications}
            unreadCount={unreadCount}
          />
          
          <CardFooter>
            <NotificationFooter />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
