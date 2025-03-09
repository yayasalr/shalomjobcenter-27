
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone } from 'lucide-react';

interface Call {
  id: string;
  with: {
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  duration?: string;
  type: 'incoming' | 'outgoing' | 'missed';
}

interface CallsTabContentProps {
  calls: Call[];
}

const CallsTabContent: React.FC<CallsTabContentProps> = ({ calls }) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        {calls && calls.length > 0 ? (
          <div className="space-y-2">
            {calls.map(call => (
              <div key={call.id} className="flex items-center p-2 border-b">
                <div>Call details would go here</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Phone className="h-12 w-12 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium">Aucun appel</h3>
            <p className="text-sm text-gray-500">
              Vos appels récents apparaîtront ici
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default CallsTabContent;
