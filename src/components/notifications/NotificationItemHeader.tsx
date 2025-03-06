
import React from 'react';
import { Bookmark, Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NotificationItemHeaderProps {
  title: string;
  timestamp: Date;
  important?: boolean;
  saved?: boolean;
  read: boolean;
}

const NotificationItemHeader = ({ title, timestamp, important, saved, read }: NotificationItemHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <h3 className={`notification-title ${
          !read ? 'text-black' : 'text-gray-700'
        }`}>
          {title}
        </h3>
        {important && (
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
        {saved && (
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
        {timestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </span>
    </div>
  );
};

export default NotificationItemHeader;
