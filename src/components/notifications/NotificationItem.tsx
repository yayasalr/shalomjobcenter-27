import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageSquare, Calendar, CreditCard, AlertTriangle, Info, Bookmark, Star, MoreHorizontal } from 'lucide-react';
import { Notification } from '@/components/notifications/types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
  
  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    } else {
      toast.success("Marqué comme lu");
    }
  };
  
  const handleMarkAsUnread = () => {
    if (onMarkAsUnread) {
      onMarkAsUnread(notification.id);
    } else {
      toast.success("Marqué comme non lu");
    }
  };
  
  const handleSave = () => {
    if (notification.saved) {
      if (onUnsave) {
        onUnsave(notification.id);
      } else {
        toast.success("Retiré des favoris");
      }
    } else {
      if (onSave) {
        onSave(notification.id);
      } else {
        toast.success("Ajouté aux favoris");
      }
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id);
    } else {
      toast.success("Notification supprimée");
    }
  };
  
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
    <div 
      className={`notification-item transition-colors relative ${
        !notification.read ? 'bg-blue-50' : ''
      } ${isHovered ? 'bg-gray-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <h3 className={`notification-title ${
                !notification.read ? 'text-black' : 'text-gray-700'
              }`}>
                {notification.title}
              </h3>
              {notification.important && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Notification importante
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {notification.saved && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Bookmark className="h-4 w-4 text-blue-500 fill-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Notification sauvegardée
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <span className="notification-timestamp text-gray-500">
              {notification.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <p className={`notification-message ${
            !notification.read ? 'text-gray-800' : 'text-gray-500'
          }`}>
            {notification.message}
          </p>
          
          <div className="flex justify-between items-center mt-2">
            {notification.actionUrl && notification.actionLabel && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="notification-action-button" 
                      variant="outline" 
                      asChild
                    >
                      <a href={notification.actionUrl}>
                        {notification.actionLabel}
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {notification.actionLabel}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <div className={`notification-actions ml-auto transition-opacity ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="notification-action-button p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      Plus d'options
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end">
                  {notification.read ? (
                    <DropdownMenuItem onClick={handleMarkAsUnread}>
                      Marquer comme non lu
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleMarkAsRead}>
                      Marquer comme lu
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSave}>
                    {notification.saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
