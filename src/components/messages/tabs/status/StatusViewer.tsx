
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusViewerProps } from './types';

const StatusViewer: React.FC<StatusViewerProps> = ({ status, onClose }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!status) return;
    
    // Reset progress when a new status is viewed
    setProgress(0);
    
    // Animate progress over 5 seconds
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 2;
      });
    }, 100);
    
    // Auto-close after 5 seconds
    const timeout = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [status, onClose]);
  
  if (!status) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-lg">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 text-white"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center mb-4 px-4">
          <div className="h-10 w-10 rounded-full mr-2 overflow-hidden border-2 border-white">
            <img 
              src={status.avatar} 
              alt={status.user} 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-white font-medium">{status.user}</p>
            <p className="text-gray-300 text-xs">
              {new Date(status.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>
        </div>
        
        {status.content && (
          <div className="p-6 text-white text-center text-xl bg-gradient-to-r from-green-500 to-blue-500 min-h-[300px] flex items-center justify-center">
            {status.content}
          </div>
        )}
        
        {status.image && (
          <div className="min-h-[300px] flex items-center justify-center bg-black">
            <img 
              src={status.image} 
              alt="Status" 
              className="max-h-[80vh] max-w-full"
            />
          </div>
        )}
        
        <div className="absolute bottom-0 w-full px-4 pb-4">
          <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden mb-4">
            <div 
              className="bg-white h-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusViewer;
