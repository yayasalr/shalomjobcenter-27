
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, CreditCard, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '@/components/notifications/types';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'reservation':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'system':
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className={`p-4 border-b transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-medium ${!notification.read ? 'text-black' : 'text-gray-700'}`}>
              {notification.title}
            </h3>
            <span className="text-xs text-gray-500">
              {notification.timestamp.toLocaleDateString()}
            </span>
          </div>
          <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-800' : 'text-gray-500'}`}>
            {notification.message}
          </p>
          {notification.actionUrl && notification.actionLabel && (
            <div className="mt-2">
              <Button size="sm" variant="outline" asChild>
                <a href={notification.actionUrl}>{notification.actionLabel}</a>
              </Button>
            </div>
          )}
        </div>
        {!notification.read && (
          <div className="h-2 w-2 bg-primary rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
