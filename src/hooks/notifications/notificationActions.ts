
import { useState } from 'react';
import { Notification } from './types';
import { toast } from 'sonner';

export const useNotificationActions = (initialNotifications: Notification[]) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true,
      }))
    );
    
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
      toast.success(`${unreadCount} notification${unreadCount > 1 ? 's' : ''} marquée${unreadCount > 1 ? 's' : ''} comme lue${unreadCount > 1 ? 's' : ''}`);
    }
  };
  
  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  // Marquer une notification comme non lue
  const markAsUnread = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: false }
          : notification
      )
    );
  };
  
  // Sauvegarder une notification
  const saveNotification = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, saved: true }
          : notification
      )
    );
  };
  
  // Retirer une notification des favoris
  const unsaveNotification = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, saved: false }
          : notification
      )
    );
  };
  
  // Supprimer une notification
  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
  };

  return {
    notifications,
    setNotifications,
    markAllAsRead,
    markAsRead,
    markAsUnread,
    saveNotification,
    unsaveNotification,
    deleteNotification
  };
};
