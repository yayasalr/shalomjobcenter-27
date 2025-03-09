
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusListProps } from './types';

const StatusList: React.FC<StatusListProps> = ({ statuses, onViewStatus }) => {
  // Function to format time elapsed
  const formatTimeElapsed = (timestamp: Date): string => {
    const now = new Date();
    const statusDate = new Date(timestamp);
    const diffMs = now.getTime() - statusDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours >= 1) {
      return `Il y a ${diffHours} h`;
    } else {
      return `Il y a ${diffMins} min`;
    }
  };

  return (
    <ScrollArea className="flex-1 overflow-y-auto">
      <div className="p-3">
        {statuses.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Récents</h3>
            {statuses.map(status => (
              <div 
                key={status.id} 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => onViewStatus(status)}
              >
                <div className={`relative ${status.isViewed ? 'border-gray-300' : 'border-green-500'} border-2 rounded-full p-0.5`}>
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img 
                      src={status.avatar} 
                      alt={status.user} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{status.user}</p>
                  <p className="text-xs text-gray-500">
                    {formatTimeElapsed(status.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-gray-400">Aucun statut récent</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default StatusList;
