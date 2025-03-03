
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OnlineStatusIndicatorProps {
  isOnline: boolean;
  lastSeen?: Date;
}

export const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({ 
  isOnline, 
  lastSeen 
}) => {
  const getTimeAgo = (date?: Date) => {
    if (!date) return 'il y a longtemps';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'à l\'instant';
    if (diffMins < 60) return `il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`h-2 w-2 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-gray-300'
            } hover:cursor-help`}
          />
        </TooltipTrigger>
        <TooltipContent>
          {isOnline 
            ? 'En ligne maintenant' 
            : lastSeen 
              ? `Vu ${getTimeAgo(lastSeen)}` 
              : 'Hors ligne'
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
