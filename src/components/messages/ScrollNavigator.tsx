
import React, { useState, useEffect, useCallback } from 'react';
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

  // Fonction optimisée pour vérifier la position de défilement
  const checkScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Calculer les marges pour déterminer si on est au sommet ou en bas
    const topThreshold = 50; // Plus généreux pour la détection du haut
    const bottomThreshold = 100; // Plus généreux pour la détection du bas
    
    const atTop = scrollTop <= topThreshold;
    const atBottom = scrollTop + clientHeight >= scrollHeight - bottomThreshold;
    
    setIsAtTop(atTop);
    setIsAtBottom(atBottom);
    
    // Ne montrer les boutons que si la hauteur de défilement est suffisante
    setShowScroller(scrollHeight > clientHeight + 200);
    
    // Détecter si l'utilisateur est en train de défiler
    const currentPosition = scrollTop;
    if (Math.abs(currentPosition - lastScrollPosition) > 5) {
      setUserIsScrolling(true);
      // Réinitialiser après un délai
      clearTimeout(window.scrollTimer);
      window.scrollTimer = setTimeout(() => {
        setUserIsScrolling(false);
      }, 500);
    }
    
    setLastScrollPosition(currentPosition);
  }, [containerRef, lastScrollPosition]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Vérifier la position initiale
    checkScrollPosition();

    // Optimiser l'écoute du défilement avec throttling
    let throttleTimer: number | null = null;
    const handleScroll = () => {
      if (!throttleTimer) {
        throttleTimer = window.setTimeout(() => {
          checkScrollPosition();
          throttleTimer = null;
        }, 100);
      }
    };
    
    // Ajouter les écouteurs d'événement
    container.addEventListener('scroll', handleScroll);
    
    // Aussi vérifier la position lors de changements de taille
    window.addEventListener('resize', checkScrollPosition);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollPosition);
      if (throttleTimer) clearTimeout(throttleTimer);
      if (window.scrollTimer) clearTimeout(window.scrollTimer);
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

  // Ne pas afficher si rien à défiler
  if (!showScroller) return null;

  // Calculer les classes de style dynamiques
  const buttonBaseClass = "h-8 w-8 rounded-full shadow-md transition-all duration-300";
  const visibleButtonClass = "opacity-80 hover:opacity-100";
  const hiddenButtonClass = "opacity-0 pointer-events-none";
  
  // Style conditionnel pour apparaître uniquement pendant un défilement actif
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
