
import React from 'react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ActionButtonProps {
  actionUrl: string;
  actionLabel: string;
}

const ActionButton = ({ actionUrl, actionLabel }: ActionButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            className="notification-action-button" 
            variant="outline" 
            asChild
          >
            <a href={actionUrl}>
              {actionLabel}
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {actionLabel}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionButton;
