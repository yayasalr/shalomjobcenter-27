
import React, { useState } from 'react';
import { Notification } from '@/components/notifications/types';
import { NotificationActions, ActionButton } from './actions';
import NotificationIcon from './NotificationIcon';
import NotificationItemHeader from './NotificationItemHeader';
import { toast } from 'sonner';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
  onSave?: (id: string) => void;
  onUnsave?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NotificationItem = ({ 
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onSave,
  onUnsave,
  onDelete
}: NotificationItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMarkAsRead = (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    } else {
      toast.success("Marqué comme lu");
    }
  };
  
  const handleMarkAsUnread = (id: string) => {
    if (onMarkAsUnread) {
      onMarkAsUnread(id);
    } else {
      toast.success("Marqué comme non lu");
    }
  };
  
  const handleSave = (id: string) => {
    if (notification.saved) {
      if (onUnsave) {
        onUnsave(id);
      } else {
        toast.success("Retiré des favoris");
      }
    } else {
      if (onSave) {
        onSave(id);
      } else {
        toast.success("Ajouté aux favoris");
      }
    }
  };
  
  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    } else {
      toast.success("Notification supprimée");
    }
  };

  return (
    <div 
      className={`notification-item transition-colors relative ${
        !notification.read ? 'bg-blue-50' : ''
      } ${isHovered ? 'bg-gray-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">
          <NotificationIcon type={notification.type} />
        </div>
        <div className="flex-1">
          <NotificationItemHeader
            title={notification.title}
            timestamp={notification.timestamp}
            important={notification.important}
            saved={notification.saved}
            read={notification.read}
          />
          
          <p className={`notification-message ${
            !notification.read ? 'text-gray-800' : 'text-gray-500'
          }`}>
            {notification.message}
          </p>
          
          <div className="flex justify-between items-center mt-2">
            {notification.actionUrl && notification.actionLabel && (
              <ActionButton 
                actionUrl={notification.actionUrl} 
                actionLabel={notification.actionLabel} 
              />
            )}
            
            <NotificationActions
              id={notification.id}
              isHovered={isHovered}
              read={notification.read}
              saved={notification.saved || false}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onSave={handleSave}
              onUnsave={handleSave}
              onDelete={handleDelete}
            />
          </div>
        </div>
        {!notification.read && (
          <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
