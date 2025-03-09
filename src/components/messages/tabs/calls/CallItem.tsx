
import React from 'react';
import { Phone, PhoneCall, Video, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CallItemProps } from './types';

const CallItem: React.FC<CallItemProps> = ({ call, onCallUser }) => {
  // Formater l'heure de l'appel
  const formatCallTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Même jour
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // Hier
    else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    }
    // Cette semaine (moins de 7 jours)
    else if (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    // Plus ancien
    else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center flex-1">
        <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
          <img 
            src={call.avatar} 
            alt={call.user} 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{call.user}</h3>
          <div className="flex items-center text-sm">
            {call.type === 'incoming' ? (
              <ArrowDownLeft className={`h-3 w-3 mr-1 ${call.missed ? 'text-red-500' : 'text-green-500'}`} />
            ) : (
              <ArrowUpRight className={`h-3 w-3 mr-1 ${call.missed ? 'text-red-500' : 'text-blue-500'}`} />
            )}
            <span className={call.missed ? 'text-red-500' : 'text-gray-500'}>
              {formatCallTime(call.timestamp)}
            </span>
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className={call.isVideo ? 'text-blue-500' : 'text-green-500'}
        onClick={() => onCallUser(call)}
      >
        {call.isVideo ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default CallItem;
