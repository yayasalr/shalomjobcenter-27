
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Eye, ImageIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { StatusListProps } from './types';

const StatusList: React.FC<StatusListProps> = ({ statuses, onViewStatus }) => {
  if (statuses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-500 text-center">
          No recent status.<br />Status updates disappear after 24 hours.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-500 mb-2">Recent</h3>
        
        <div className="space-y-3">
          {statuses.map((status) => (
            <div 
              key={status.id} 
              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md"
              onClick={() => onViewStatus(status)}
            >
              <div className={`h-12 w-12 rounded-full border-2 ${status.isViewed ? 'border-gray-300' : 'border-green-500'} p-0.5 status-ring ${status.isViewed ? 'status-ring-viewed' : 'status-active'}`}>
                <Avatar>
                  <img 
                    src={status.avatar} 
                    alt={status.user} 
                    className="h-full w-full rounded-full object-cover"
                  />
                </Avatar>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{status.user}</p>
                <p className="text-xs text-gray-500">
                  {status.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {status.content && (
                <div className="bg-gray-100 px-3 py-1 rounded text-sm max-w-[150px] truncate">
                  {status.content}
                </div>
              )}
              {status.image && (
                <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden">
                  <img src={status.image} alt="Status" className="h-full w-full object-cover" />
                </div>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                className="ml-2 text-gray-500 hover:text-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewStatus(status);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default StatusList;
