
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationItem from './NotificationItem';
import EmptyNotificationState from './EmptyNotificationState';
import { Notification } from './types';

interface NotificationTabsProps {
  notifications: Notification[];
  unreadCount: number;
}

const NotificationTabs = ({ notifications, unreadCount }: NotificationTabsProps) => {
  return (
    <Tabs defaultValue="all">
      <div className="px-6">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
          <TabsTrigger value="unread" className="flex-1">Non lues ({unreadCount})</TabsTrigger>
          <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
          <TabsTrigger value="reservations" className="flex-1">Réservations</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all">
        <div className="max-h-[600px] overflow-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <EmptyNotificationState type="all" />
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="unread">
        <div className="max-h-[600px] overflow-auto">
          {notifications.filter(n => !n.read).length > 0 ? (
            notifications.filter(n => !n.read).map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <EmptyNotificationState type="unread" />
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="messages">
        <div className="max-h-[600px] overflow-auto">
          {notifications.filter(n => n.type === 'message').length > 0 ? (
            notifications.filter(n => n.type === 'message').map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <EmptyNotificationState type="messages" />
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="reservations">
        <div className="max-h-[600px] overflow-auto">
          {notifications.filter(n => n.type === 'reservation').length > 0 ? (
            notifications.filter(n => n.type === 'reservation').map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <EmptyNotificationState type="reservations" />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default NotificationTabs;
