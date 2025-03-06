
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

const NotificationHeader = ({ unreadCount, onMarkAllAsRead }: NotificationHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8 mt-8">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Badge className="bg-primary h-6">
            {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
        Tout marquer comme lu
      </Button>
    </div>
  );
};

export default NotificationHeader;
