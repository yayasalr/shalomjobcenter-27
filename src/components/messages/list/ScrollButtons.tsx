
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ScrollButtonsProps {
  showScrollButtons: boolean;
  isAtBottom: boolean;
  scrollToBottom: () => void;
  scrollToTop: () => void;
}

export const ScrollButtons: React.FC<ScrollButtonsProps> = ({
  showScrollButtons,
  isAtBottom,
  scrollToBottom,
  scrollToTop
}) => {
  if (!showScrollButtons) return null;
  
  return (
    <div className="absolute right-4 bottom-4 flex flex-col items-center space-y-2 z-10">
      {!isAtBottom && (
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full shadow-md bg-white"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      )}
      <Button 
        variant="secondary" 
        size="icon" 
        className="rounded-full shadow-md bg-white"
        onClick={scrollToTop}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
    </div>
  );
};
