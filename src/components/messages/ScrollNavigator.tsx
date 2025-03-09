
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScrollNavigatorProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const ScrollNavigator: React.FC<ScrollNavigatorProps> = ({ containerRef }) => {
  const [showScroller, setShowScroller] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [userIsScrolling, setUserIsScrolling] = useState(false);
  const scrollTimerRef = useRef<number | null>(null);
  const throttleTimerRef = useRef<number | null>(null);

  // Optimized function to check scroll position
  const checkScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Calculate margins to determine if at top or bottom
    const topThreshold = 50; // More generous for top detection
    const bottomThreshold = 100; // More generous for bottom detection
    
    const atTop = scrollTop <= topThreshold;
    const atBottom = scrollTop + clientHeight >= scrollHeight - bottomThreshold;
    
    setIsAtTop(atTop);
    setIsAtBottom(atBottom);
    
    // Only show buttons if scroll height is sufficient
    setShowScroller(scrollHeight > clientHeight + 200);
    
    // Detect if user is scrolling
    const currentPosition = scrollTop;
    if (Math.abs(currentPosition - lastScrollPosition) > 5) {
      setUserIsScrolling(true);
      // Reset after a delay
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      scrollTimerRef.current = window.setTimeout(() => {
        setUserIsScrolling(false);
      }, 500);
    }
    
    setLastScrollPosition(currentPosition);
  }, [containerRef, lastScrollPosition]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check initial position
    checkScrollPosition();

    // Optimize scroll listening with throttling
    const handleScroll = () => {
      if (!throttleTimerRef.current) {
        throttleTimerRef.current = window.setTimeout(() => {
          checkScrollPosition();
          throttleTimerRef.current = null;
        }, 100);
      }
    };
    
    // Add event listeners
    container.addEventListener('scroll', handleScroll);
    
    // Also check position on size changes
    window.addEventListener('resize', checkScrollPosition);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollPosition);
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [containerRef, checkScrollPosition]);

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

  // Don't display if nothing to scroll
  if (!showScroller) return null;

  // Calculate dynamic style classes
  const buttonBaseClass = "h-8 w-8 rounded-full shadow-md transition-all duration-300";
  const visibleButtonClass = "opacity-80 hover:opacity-100";
  const hiddenButtonClass = "opacity-0 pointer-events-none";
  
  // Conditional style to appear only during active scrolling
  const containerClass = userIsScrolling 
    ? "opacity-100 transition-opacity duration-300" 
    : "opacity-70 hover:opacity-100 transition-opacity duration-300";

  return (
    <div className={`absolute right-4 bottom-20 flex flex-col gap-2 ${containerClass}`}>
      {!isAtTop && (
        <Button 
          variant="secondary" 
          size="icon" 
          className={`${buttonBaseClass} ${!isAtTop ? visibleButtonClass : hiddenButtonClass} bg-white/90`}
          onClick={scrollToTop}
          aria-label="Défiler vers le haut"
        >
          <ChevronUp className="h-4 w-4" />
          <span className="sr-only">Défiler vers le haut</span>
        </Button>
      )}
      
      {!isAtBottom && (
        <Button 
          variant="secondary" 
          size="icon" 
          className={`${buttonBaseClass} ${!isAtBottom ? visibleButtonClass : hiddenButtonClass} bg-white/90`}
          onClick={scrollToBottom}
          aria-label="Défiler vers le bas"
        >
          <ChevronDown className="h-4 w-4" />
          <span className="sr-only">Défiler vers le bas</span>
        </Button>
      )}
    </div>
  );
};

export default ScrollNavigator;
