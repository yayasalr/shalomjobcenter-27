
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'reservation' | 'payment' | 'system' | 'alert';
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
  actionLabel?: string;
  important?: boolean;
  saved?: boolean;
  category?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sound: boolean;
  types: {
    [key in Notification['type']]: boolean;
  };
}

export interface NotificationGroup {
  date: Date;
  notifications: Notification[];
}
