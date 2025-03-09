
import React from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { CallItemProps } from './types';

const CallItem: React.FC<CallItemProps> = ({ call, onCallUser }) => {
  return (
    <div 
      className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
    >
      <Avatar className="h-10 w-10">
        <img 
          src={call.avatar} 
          alt={call.user} 
          className="h-full w-full rounded-full object-cover"
        />
      </Avatar>
      
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{call.user}</p>
        <div className="flex items-center text-xs">
          {call.type === 'incoming' ? (
            call.missed ? (
              <PhoneMissed className="h-3 w-3 text-red-500 mr-1" />
            ) : (
              <PhoneIncoming className="h-3 w-3 text-green-500 mr-1" />
            )
          ) : (
            <PhoneOutgoing className="h-3 w-3 text-blue-500 mr-1" />
          )}
          
          <span className={`${call.missed ? 'text-red-500' : 'text-gray-500'}`}>
            {call.type === 'incoming' ? 'Entrant' : 'Sortant'} 
            {call.isVideo && ' · Vidéo'}
            {call.missed && ' · Manqué'}
          </span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        {call.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="ml-2 text-green-500 hover:text-green-600 hover:bg-green-50"
        onClick={() => {
          toast.info(`Appeler ${call.user}?`);
          onCallUser(call);
        }}
      >
        {call.isVideo ? (
          <Video className="h-4 w-4" />
        ) : (
          <Phone className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default CallItem;
