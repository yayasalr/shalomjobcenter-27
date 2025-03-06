
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'reservation' | 'payment' | 'system' | 'alert';
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
  actionLabel?: string;
}
