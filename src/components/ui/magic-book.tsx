import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface MagicBookProps {
  className?: string;
  title?: string;
  onClick?: () => void;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  isOpen?: boolean;
}

export const MagicBook: React.FC<MagicBookProps> = ({ 
  className = "",
  title = "Logements en Afrique et partout dans le monde",
  onClick,
  position = "bottom-left",
  isOpen = false
}) => {
  const [pageCount, setPageCount] = useState(0);
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  
  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (localIsOpen) {
        setPageCount((prev) => (prev + 1) % 5);
      }
    }, 1500); // Faster page turning
    
    return () => clearInterval(interval);
  }, [localIsOpen]);

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
        setLocalIsOpen((prev) => !prev);
        if (onClick) onClick();
      }}
      onMouseEnter={() => setLocalIsOpen(true)}
      onMouseLeave={() => !isOpen && setLocalIsOpen(false)}
    >
      <motion.div
        className="relative w-20 h-28 md:w-24 md:h-32 bg-white rounded-md shadow-xl overflow-hidden"
        animate={{
          y: [0, -5, 0],
          rotate: localIsOpen ? [0, 2, 0, -2, 0] : 0,
        }}
        transition={{
          duration: localIsOpen ? 3 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 bg-white rounded-md shadow-lg flex flex-col">
          <div className="bg-white py-1 px-2 flex items-center gap-1 shadow-sm rounded-t-md">
            <motion.div
              animate={{ rotate: localIsOpen ? 360 : 0 }}
              transition={{ duration: 2, repeat: localIsOpen ? Infinity : 0, ease: "linear" }}
            >
              <Trophy className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
            </motion.div>
            <div className="text-black text-[6px] md:text-[8px] font-medium overflow-hidden whitespace-nowrap text-ellipsis">
              {title}
            </div>
          </div>
          
          <div className="flex-grow flex items-center justify-center p-2">
            <motion.div 
              className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gray-200"
              animate={{ scale: localIsOpen ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: localIsOpen ? Infinity : 0, ease: "easeInOut" }}
            >
              <img 
                src="/lovable-uploads/e3037485-6218-4d0a-a5ec-734b9943c37d.png" 
                alt="Host" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = getRandomFallbackImage();
                }}
              />
            </motion.div>
          </div>
        </div>
        
        {localIsOpen && (
          <>
            <motion.div
              className="absolute top-8 left-2 right-5 bottom-2 bg-white rounded-sm shadow-md"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: pageCount * 40 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            <motion.div
              className="absolute top-10 left-3 right-7 bottom-3 bg-white/90 rounded-sm"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: pageCount * 25 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            ></motion.div>
            <motion.div
              className="absolute top-12 left-4 right-9 bottom-4 bg-white/80 rounded-sm"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: pageCount * 15 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            ></motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

const getRandomFallbackImage = () => {
  const fallbacks = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};
