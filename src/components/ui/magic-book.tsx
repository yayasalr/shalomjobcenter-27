
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MagicBookProps {
  className?: string;
  title?: string;
  onClick?: () => void;
}

export const MagicBook: React.FC<MagicBookProps> = ({ 
  className = "",
  title = "Guide du voyageur",
  onClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  
  // Effet pour tourner les pages automatiquement
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOpen) {
        setPageCount((prev) => (prev + 1) % 5);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isOpen]);
  
  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={() => {
        setIsOpen((prev) => !prev);
        if (onClick) onClick();
      }}
    >
      <motion.div
        className="relative w-28 h-36 rounded-md overflow-hidden"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Livre */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-700 to-amber-900 rounded-md shadow-xl">
          {/* Couverture */}
          <div className="absolute inset-0 p-2">
            <div className="h-full w-full border-2 border-amber-500/30 rounded-sm flex items-center justify-center">
              <div className="text-amber-200 text-xs font-serif text-center px-1">
                {title}
              </div>
            </div>
          </div>
          
          {/* Tranche dorée */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-300"></div>
        </div>
        
        {/* Pages qui tournent */}
        {isOpen && (
          <>
            <motion.div
              className="absolute top-2 left-2 right-5 bottom-2 bg-white rounded-sm shadow-md"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: pageCount * 30 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            <motion.div
              className="absolute top-3 left-3 right-7 bottom-3 bg-white/90 rounded-sm"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: pageCount * 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            ></motion.div>
          </>
        )}
        
        {/* Aura lumineuse */}
        <motion.div
          className="absolute inset-0 bg-amber-300/20 rounded-md blur-md"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        ></motion.div>
      </motion.div>
      
      {/* Lueur */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-200/30 rounded-full blur-xl -z-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
    </div>
  );
};
