
import { useState, useEffect, useRef, RefObject } from 'react';

interface InViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: InViewOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', once = false, delay = 0 } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Si once est true et que l'élément est déjà visible, ne pas continuer
    if (once && isInView) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting) {
        // Ajouter un délai si spécifié
        if (delay > 0) {
          setTimeout(() => {
            setIsInView(true);
          }, delay);
        } else {
          setIsInView(true);
        }
        
        // Si once est true, déconnecte l'observateur après la première vue
        if (once) {
          observer.disconnect();
        }
      } else if (!once) {
        setIsInView(false);
      }
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, isInView, delay]);

  return [ref, isInView];
}
