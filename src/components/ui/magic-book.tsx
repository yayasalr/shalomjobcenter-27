
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface MagicBookProps {
  className?: string;
  title?: string;
  onClick?: () => void;
}

export const MagicBook: React.FC<MagicBookProps> = ({ 
  className = "",
  title = "Coup de cœur voyageurs",
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
        className="relative w-24 h-32 md:w-28 md:h-36 bg-white rounded-md shadow-xl overflow-hidden"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Livre */}
        <div className="absolute inset-0 bg-white rounded-md shadow-lg flex flex-col">
          {/* Bannière supérieure avec le trophée */}
          <div className="bg-white py-1 px-2 flex items-center gap-1 shadow-sm rounded-t-md">
            <Trophy className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
            <div className="text-black text-[8px] md:text-[10px] font-medium overflow-hidden">
              {title}
            </div>
          </div>
          
          {/* Image de profil */}
          <div className="flex-grow flex items-center justify-center p-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-gray-200">
              <img 
                src="/lovable-uploads/e3037485-6218-4d0a-a5ec-734b9943c37d.png" 
                alt="Host" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = getRandomFallbackImage();
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Pages qui tournent */}
        {isOpen && (
          <>
            <motion.div
              className="absolute top-8 left-2 right-5 bottom-2 bg-white rounded-sm shadow-md"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: pageCount * 30 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            <motion.div
              className="absolute top-10 left-3 right-7 bottom-3 bg-white/90 rounded-sm"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: pageCount * 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            ></motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

// Helper function for random fallback image
const getRandomFallbackImage = () => {
  const fallbacks = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};
