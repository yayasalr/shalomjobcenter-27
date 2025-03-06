
import { Notification as NotificationComponent } from '@/components/notifications/types';

// Re-export the notification type from the components directory
export type Notification = NotificationComponent;
export type NotificationGroup = {
  date: Date;
  notifications: Notification[];
};

export type FilterType = string | null;

export interface UseNotificationsReturn {
  notifications: Notification[];
  groupedNotifications: NotificationGroup[];
  unreadCount: number;
  isConnected: boolean;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  saveNotification: (id: string) => void;
  unsaveNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
}
