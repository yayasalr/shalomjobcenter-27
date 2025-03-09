
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScrollNavigatorProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const ScrollNavigator: React.FC<ScrollNavigatorProps> = ({ containerRef }) => {
  const [showScroller, setShowScroller] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setIsAtTop(scrollTop <= 10);
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
      setShowScroller(scrollHeight > clientHeight + 100);
    };

    // Check initial scroll position
    checkScrollPosition();

    // Add scroll event listener
    container.addEventListener('scroll', checkScrollPosition);
    
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [containerRef]);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  if (!showScroller) return null;

  return (
    <div className="absolute right-4 bottom-20 flex flex-col gap-2">
      {!isAtTop && (
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-8 w-8 rounded-full shadow-md bg-white/90"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-4 w-4" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      )}
      
      {!isAtBottom && (
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-8 w-8 rounded-full shadow-md bg-white/90"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
          <span className="sr-only">Scroll to bottom</span>
        </Button>
      )}
    </div>
  );
};

export default ScrollNavigator;
