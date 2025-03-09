
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { RecentStatusListProps } from '../types';

const RecentStatusList: React.FC<RecentStatusListProps> = ({ statuses, onStatusClick }) => {
  return (
    <div className="p-3 border-b">
      <h3 className="font-medium mb-2">Statuts récents</h3>
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-2">
          {statuses.map(status => (
            <div 
              key={status.id}
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => onStatusClick(status)}
            >
              <Avatar className="h-12 w-12 mr-3">
                <img src={status.user.avatar} alt={status.user.name} />
              </Avatar>
              <div>
                <p className="font-medium">{status.user.name}</p>
                <p className="text-xs text-gray-500">
                  Il y a {Math.floor(Math.random() * 59) + 1} min
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecentStatusList;
