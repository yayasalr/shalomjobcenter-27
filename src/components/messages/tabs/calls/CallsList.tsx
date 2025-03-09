
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PhoneCall } from 'lucide-react';
import { CallsListProps } from './types';
import CallItem from './CallItem';

const CallsList: React.FC<CallsListProps> = ({ calls, onCallUser }) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-3">
        {calls.length > 0 ? (
          <div className="space-y-3">
            {calls.map((call) => (
              <CallItem 
                key={call.id} 
                call={call} 
                onCallUser={onCallUser} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <PhoneCall className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-center">
              Aucun appel récent.<br />
              Cliquez sur 'Audio' ou 'Vidéo' pour passer un appel.
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default CallsList;
