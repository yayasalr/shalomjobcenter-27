
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface NotificationActionsProps {
  id: string;
  isHovered: boolean;
  read: boolean;
  saved: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onSave: (id: string) => void;
  onUnsave: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationActions = ({
  id,
  isHovered,
  read,
  saved,
  onMarkAsRead,
  onMarkAsUnread,
  onSave,
  onUnsave,
  onDelete
}: NotificationActionsProps) => {
  const handleMarkAsRead = () => {
    onMarkAsRead(id);
  };
  
  const handleMarkAsUnread = () => {
    onMarkAsUnread(id);
  };
  
  const handleSave = () => {
    if (saved) {
      onUnsave(id);
    } else {
      onSave(id);
    }
  };
  
  const handleDelete = () => {
    onDelete(id);
  };

  return (
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
          {read ? (
            <DropdownMenuItem onClick={handleMarkAsUnread}>
              Marquer comme non lu
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleMarkAsRead}>
              Marquer comme lu
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleSave}>
            {saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-500">
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationActions;
