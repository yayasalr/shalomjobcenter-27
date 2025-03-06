
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface StatusType {
  id: number;
  user: string;
  avatar: string;
  isViewed: boolean;
  timestamp: Date;
}

interface StatusTabContentProps {
  statuses: StatusType[];
}

const StatusTabContent: React.FC<StatusTabContentProps> = ({ statuses }) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="relative mr-3">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
              <User className="h-3 w-3 text-white" />
            </div>
          </div>
          <div>
            <div className="font-medium">Mon statut</div>
            <div className="text-xs text-gray-500">Ajouter un statut</div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Mises à jour récentes</h3>
          {statuses.map(status => (
            <div key={status.id} className="flex items-center py-2 cursor-pointer">
              <div className="relative mr-3">
                <Avatar className={`h-12 w-12 ${status.isViewed ? 'border-2 border-gray-300' : 'border-2 border-green-500'}`}>
                  <AvatarImage src={status.avatar} />
                  <AvatarFallback>{status.user.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="font-medium">{status.user}</div>
                <div className="text-xs text-gray-500">
                  {status.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default StatusTabContent;
