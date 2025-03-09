
import React from 'react';
import { Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CallHeaderProps {
  onStartCall: (isVideo: boolean) => void;
}

const CallHeader: React.FC<CallHeaderProps> = ({ onStartCall }) => {
  return (
    <div className="p-3 bg-white border-b">
      <div className="flex justify-between">
        <h2 className="text-sm font-medium">Appels récents</h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => onStartCall(false)}
          >
            <Phone className="h-4 w-4 mr-1" />
            Audio
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => onStartCall(true)}
          >
            <Video className="h-4 w-4 mr-1" />
            Vidéo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallHeader;
