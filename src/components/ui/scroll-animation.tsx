
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

type Direction = 'left' | 'right' | 'up' | 'down' | 'none';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
  distance?: number;
  staggerChildren?: number;
  staggerContainer?: boolean;
}

export const ScrollAnimation = ({
  children,
  className,
  direction = 'left',
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  once = true,
  distance = 100,
  staggerChildren = 0.1,
  staggerContainer = false,
}: ScrollAnimationProps) => {
  const [ref, isInView] = useInView({ once, threshold });

  const getDirectionVariants = (dist: number) => ({
    left: { hidden: { x: -dist, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: dist, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    up: { hidden: { y: dist, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    down: { hidden: { y: -dist, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    none: { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  });

  const variants = getDirectionVariants(distance)[direction];

  const containerVariants = staggerContainer ? {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren,
        delayChildren: delay,
      }
    }
  } : variants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      transition={!staggerContainer ? {
        duration,
        delay,
        ease: "easeOut"
      } : undefined}
      className={cn(className)}
    >
      {staggerContainer ? (
        React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          
          return (
            <motion.div
              variants={variants}
              transition={{
                duration,
                ease: "easeOut"
              }}
            >
              {child}
            </motion.div>
          );
        })
      ) : children}
    </motion.div>
  );
};
