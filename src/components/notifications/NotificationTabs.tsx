
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationItem from './NotificationItem';
import EmptyNotificationState from './EmptyNotificationState';
import { Notification, NotificationGroup } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationTabsProps {
  notifications: Notification[];
  groupedNotifications: NotificationGroup[];
  unreadCount: number;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
  onSave?: (id: string) => void;
  onUnsave?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NotificationTabs = ({ 
  notifications, 
  groupedNotifications,
  unreadCount,
  onMarkAsRead,
  onMarkAsUnread,
  onSave,
  onUnsave,
  onDelete
}: NotificationTabsProps) => {
  const renderDateHeader = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.getTime() === today.getTime()) {
      return "Aujourd'hui";
    } else if (date.getTime() === yesterday.getTime()) {
      return "Hier";
    } else if (date.getTime() === 0) {
      return "Plus ancien";
    } else {
      return format(date, 'EEEE d MMMM', { locale: fr });
    }
  };

  return (
    <Tabs defaultValue="all">
      <div className="px-6">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
          <TabsTrigger value="unread" className="flex-1">Non lues ({unreadCount})</TabsTrigger>
          <TabsTrigger value="grouped" className="flex-1">Groupées</TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">Sauvegardées</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all">
        <div className="max-h-[600px] overflow-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={onMarkAsRead}
                onMarkAsUnread={onMarkAsUnread}
                onSave={onSave}
                onUnsave={onUnsave}
                onDelete={onDelete}
              />
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
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={onMarkAsRead}
                onMarkAsUnread={onMarkAsUnread}
                onSave={onSave}
                onUnsave={onUnsave}
                onDelete={onDelete}
              />
            ))
          ) : (
            <EmptyNotificationState type="unread" />
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="grouped">
        <div className="max-h-[600px] overflow-auto">
          {groupedNotifications.length > 0 ? (
            groupedNotifications.map((group, index) => (
              <div key={index}>
                <div className="px-4 py-2 bg-gray-100 font-medium text-gray-700 sticky top-0 z-10">
                  {renderDateHeader(group.date)}
                </div>
                {group.notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={onMarkAsRead}
                    onMarkAsUnread={onMarkAsUnread}
                    onSave={onSave}
                    onUnsave={onUnsave}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            ))
          ) : (
            <EmptyNotificationState type="all" />
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="saved">
        <div className="max-h-[600px] overflow-auto">
          {notifications.filter(n => n.saved).length > 0 ? (
            notifications.filter(n => n.saved).map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={onMarkAsRead}
                onMarkAsUnread={onMarkAsUnread}
                onSave={onSave}
                onUnsave={onUnsave}
                onDelete={onDelete}
              />
            ))
          ) : (
            <EmptyNotificationState type="saved" />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default NotificationTabs;
