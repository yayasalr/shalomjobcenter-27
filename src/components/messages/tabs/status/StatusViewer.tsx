
import React, { useEffect, useState } from 'react';
import { X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusViewerProps, StatusViewer as StatusViewerType } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTimeElapsed } from './utils/statusUtils';
import useLocalStorage from '@/hooks/useLocalStorage';

interface CurrentUser {
  id: string;
  name: string;
  avatar?: string;
}

const StatusViewer: React.FC<StatusViewerProps> = ({ status, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const { loadData, saveData } = useLocalStorage();
  
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
    
    // Record view if not already viewed
    if (status) {
      const viewedStatuses = loadData<Record<number, boolean>>('viewed-statuses', {});
      
      if (!viewedStatuses[status.id]) {
        // Record the viewer
        const currentUser = loadData<CurrentUser>('currentUser', { 
          id: 'user-1', 
          name: 'Utilisateur', 
          avatar: '/placeholder.svg' 
        });
        
        // Get existing viewers
        const statusViewers = loadData<StatusViewerType[]>(`status-viewers-${status.id}`, []);
        
        // Add current user to viewers if not already there
        if (!statusViewers.some((viewer) => viewer.id === currentUser.id)) {
          const updatedViewers = [
            ...statusViewers,
            {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar || '/placeholder.svg',
              viewedAt: new Date().toISOString()
            }
          ];
          
          saveData(`status-viewers-${status.id}`, updatedViewers);
        }
        
        // Mark as viewed
        viewedStatuses[status.id] = true;
        saveData('viewed-statuses', viewedStatuses);
      }
    }
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [status, onClose, loadData, saveData]);
  
  if (!status) return null;

  // Load viewers
  const viewers = loadData<StatusViewerType[]>(`status-viewers-${status.id}`, []);
  const viewCount = viewers.length;

  const toggleViewers = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowViewers(!showViewers);
  };

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
          <div className="flex-1">
            <p className="text-white font-medium">{status.user}</p>
            <p className="text-gray-300 text-xs">
              {formatTimeElapsed(status.timestamp)}
            </p>
          </div>
          <div 
            className="flex items-center text-white cursor-pointer"
            onClick={toggleViewers}
          >
            <Eye className="h-4 w-4 mr-1" />
            <span className="text-sm">{viewCount}</span>
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
        
        {showViewers && (
          <div className="absolute bottom-16 right-4 bg-gray-900 rounded-lg p-3 w-64 max-h-48 overflow-y-auto">
            <h3 className="text-white font-medium mb-2 text-sm">Vu par ({viewCount})</h3>
            {viewers.length > 0 ? (
              <div className="space-y-2">
                {viewers.map((viewer) => (
                  <div key={viewer.id} className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={viewer.avatar} />
                      <AvatarFallback>{viewer.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white text-sm">{viewer.name}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(viewer.viewedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Personne n'a encore vu ce statut</p>
            )}
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
