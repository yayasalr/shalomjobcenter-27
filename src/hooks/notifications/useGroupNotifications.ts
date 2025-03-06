
import { Notification, NotificationGroup } from './types';

export const useGroupNotifications = (notifications: Notification[], filterType: string | null) => {
  // Filtrer les notifications selon le type sélectionné
  const filteredNotifications = filterType 
    ? notifications.filter(n => n.type === filterType)
    : notifications;
  
  // Grouper les notifications par date (aujourd'hui, hier, cette semaine, plus ancien)
  const groupNotifications = (): NotificationGroup[] => {
    const groups: NotificationGroup[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    // Aujourd'hui
    const todayNotifications = filteredNotifications.filter(n => {
      const date = new Date(n.timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });
    
    if (todayNotifications.length > 0) {
      groups.push({
        date: today,
        notifications: todayNotifications,
      });
    }
    
    // Hier
    const yesterdayNotifications = filteredNotifications.filter(n => {
      const date = new Date(n.timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === yesterday.getTime();
    });
    
    if (yesterdayNotifications.length > 0) {
      groups.push({
        date: yesterday,
        notifications: yesterdayNotifications,
      });
    }
    
    // Cette semaine
    const thisWeekNotifications = filteredNotifications.filter(n => {
      const date = new Date(n.timestamp);
      date.setHours(0, 0, 0, 0);
      return date > lastWeek && date < yesterday;
    });
    
    if (thisWeekNotifications.length > 0) {
      groups.push({
        date: lastWeek,
        notifications: thisWeekNotifications,
      });
    }
    
    // Plus ancien
    const olderNotifications = filteredNotifications.filter(n => {
      const date = new Date(n.timestamp);
      date.setHours(0, 0, 0, 0);
      return date < lastWeek;
    });
    
    if (olderNotifications.length > 0) {
      groups.push({
        date: new Date(0), // Date d'epoch pour "Plus ancien"
        notifications: olderNotifications,
      });
    }
    
    return groups;
  };
  
  return {
    filteredNotifications,
    groupedNotifications: groupNotifications(),
    unreadCount: notifications.filter(n => !n.read).length
  };
};
