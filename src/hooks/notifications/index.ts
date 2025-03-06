
import { useState } from 'react';
import { initialNotifications } from './mockData';
import { useNotificationActions } from './notificationActions';
import { useGroupNotifications } from './useGroupNotifications';
import { useConnectionSimulation } from './useConnectionSimulation';
import { FilterType, UseNotificationsReturn } from './types';

export const useNotifications = (): UseNotificationsReturn => {
  const [filterType, setFilterType] = useState<FilterType>(null);
  
  const {
    notifications,
    setNotifications,
    markAllAsRead,
    markAsRead,
    markAsUnread,
    saveNotification,
    unsaveNotification,
    deleteNotification
  } = useNotificationActions(initialNotifications);
  
  const { 
    filteredNotifications, 
    groupedNotifications, 
    unreadCount 
  } = useGroupNotifications(notifications, filterType);
  
  const { isConnected } = useConnectionSimulation(setNotifications);

  return {
    notifications: filteredNotifications,
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
  };
};

export * from './types';
