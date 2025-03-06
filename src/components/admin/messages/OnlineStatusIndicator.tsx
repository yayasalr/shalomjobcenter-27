
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cva } from 'class-variance-authority';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OnlineStatusIndicatorProps {
  isOnline: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  lastActive?: Date;
  showTooltip?: boolean;
}

const indicatorStyles = cva(
  "rounded-full inline-block", 
  {
    variants: {
      size: {
        sm: "w-2 h-2",
        md: "w-3 h-3",
        lg: "w-4 h-4"
      },
      status: {
        online: "bg-green-500",
        offline: "bg-gray-400"
      }
    },
    defaultVariants: {
      size: "md",
      status: "offline"
    }
  }
);

// Fonction pour formater le temps écoulé depuis la dernière activité
const getLastActiveText = (lastActive?: Date): string => {
  if (!lastActive) return "Dernière activité inconnue";
  
  const now = new Date();
  const diffMs = now.getTime() - lastActive.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return "Actif à l'instant";
  if (diffMins < 60) return `Actif il y a ${diffMins} min`;
  if (diffHours < 24) return `Actif il y a ${diffHours} h`;
  return `Actif il y a ${diffDays} j`;
};

export const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({ 
  isOnline, 
  showLabel = false,
  size = 'md',
  lastActive,
  showTooltip = false
}) => {
  const indicator = (
    <div className="flex items-center gap-1.5">
      <span 
        className={indicatorStyles({ 
          size, 
          status: isOnline ? 'online' : 'offline'
        })}
      />
      
      {showLabel && (
        <span className="text-xs">
          {isOnline ? 'En ligne' : lastActive ? getLastActiveText(lastActive) : 'Hors ligne'}
        </span>
      )}
    </div>
  );
  
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {indicator}
          </TooltipTrigger>
          <TooltipContent>
            {isOnline ? 'En ligne' : lastActive ? getLastActiveText(lastActive) : 'Hors ligne'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return indicator;
};

export const OnlineStatusBadge: React.FC<Omit<OnlineStatusIndicatorProps, 'size'>> = ({
  isOnline,
  showLabel = true,
  lastActive
}) => {
  return (
    <Badge 
      variant="outline" 
      className={`${isOnline ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}
    >
      <div className="flex items-center gap-1.5">
        <span 
          className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
        />
        {showLabel && (
          <span>
            {isOnline ? 'En ligne' : lastActive ? getLastActiveText(lastActive) : 'Hors ligne'}
          </span>
        )}
      </div>
    </Badge>
  );
};
