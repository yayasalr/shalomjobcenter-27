
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface MagicBookProps {
  className?: string;
  title?: string;
  onClick?: () => void;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

export const MagicBook: React.FC<MagicBookProps> = ({ 
  className = "",
  title = "Coup de cœur voyageurs",
  onClick,
  position = "bottom-left"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  
  // Effect to automatically turn pages
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOpen) {
        setPageCount((prev) => (prev + 1) % 5);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  // Determine position classes
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "left-3 bottom-3";
      case "bottom-right":
        return "right-3 bottom-3";
      case "top-left":
        return "left-3 top-3";
      case "top-right":
        return "right-3 top-3";
      default:
        return "left-3 bottom-3";
    }
  };
  
  return (
    <motion.div 
      className={`absolute ${getPositionClasses()} z-10 cursor-pointer shadow-lg ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onClick={() => {
        setIsOpen((prev) => !prev);
        if (onClick) onClick();
      }}
    >
      <motion.div
        className="relative w-20 h-28 md:w-24 md:h-32 bg-white rounded-md shadow-xl overflow-hidden"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Book */}
        <div className="absolute inset-0 bg-white rounded-md shadow-lg flex flex-col">
          {/* Top banner with trophy */}
          <div className="bg-white py-1 px-2 flex items-center gap-1 shadow-sm rounded-t-md">
            <Trophy className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
            <div className="text-black text-[8px] md:text-[10px] font-medium overflow-hidden whitespace-nowrap text-ellipsis">
              {title}
            </div>
          </div>
          
          {/* Profile image */}
          <div className="flex-grow flex items-center justify-center p-2">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gray-200">
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
        
        {/* Pages turning */}
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
    </motion.div>
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
