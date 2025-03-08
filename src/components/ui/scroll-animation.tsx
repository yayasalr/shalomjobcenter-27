
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
}

export const ScrollAnimation = ({
  children,
  className,
  direction = 'left',
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  once = true,
}: ScrollAnimationProps) => {
  const [ref, isInView] = useInView({ once, threshold });

  const directionToVariant = {
    left: { hidden: { x: -100, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: 100, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    up: { hidden: { y: 100, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    down: { hidden: { y: -100, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    none: { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  };

  const variants = directionToVariant[direction];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};
