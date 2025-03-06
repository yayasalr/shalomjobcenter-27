
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone } from 'lucide-react';

interface CallType {
  id: number;
  user: string;
  avatar: string;
  type: 'incoming' | 'outgoing';
  timestamp: Date;
  missed: boolean;
}

interface CallsTabContentProps {
  calls: CallType[];
}

const CallsTabContent: React.FC<CallsTabContentProps> = ({ calls }) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        {calls.map(call => (
          <div key={call.id} className="flex items-center py-2 border-b">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={call.avatar} />
              <AvatarFallback>{call.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{call.user}</div>
              <div className="flex items-center text-xs">
                <Phone className={`h-3 w-3 mr-1 ${call.type === 'incoming' ? 'transform rotate-90' : 'transform -rotate-90'} ${call.missed ? 'text-red-500' : 'text-green-500'}`} />
                <span className={`${call.missed ? 'text-red-500' : 'text-gray-500'}`}>
                  {call.type === 'incoming' ? 'Entrant' : 'Sortant'} • {call.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
            <Phone className="h-5 w-5 text-green-500 cursor-pointer" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CallsTabContent;
