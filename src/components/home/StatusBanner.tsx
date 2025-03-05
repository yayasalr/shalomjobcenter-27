
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusMessage } from '@/components/admin/status/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const StatusBanner: React.FC = () => {
  const { loadData } = useLocalStorage();
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  // Load status messages on component mount
  useEffect(() => {
    try {
      const rawData = loadData<any>('admin-status-messages', []);
      let processedMessages: StatusMessage[] = [];
      
      if (Array.isArray(rawData)) {
        // Check if it's already a flat array of StatusMessage objects
        if (rawData.length === 0 || (rawData.length > 0 && typeof rawData[0] === 'object' && rawData[0] !== null && 'id' in rawData[0])) {
          processedMessages = rawData as StatusMessage[];
        } 
        // Check if it's a nested array and flatten it
        else if (rawData.length > 0 && Array.isArray(rawData[0])) {
          const flattened = (rawData as any[]).flat();
          if (flattened.length > 0 && typeof flattened[0] === 'object' && flattened[0] !== null && 'id' in flattened[0]) {
            processedMessages = flattened as StatusMessage[];
          }
        }
      }
      
      setStatusMessages(processedMessages);
    } catch (error) {
      console.error('Error loading status messages:', error);
      setStatusMessages([]);
    }
  }, [loadData]); // Only run once on mount with stable loadData reference

  // Filter active statuses
  const activeMessages = statusMessages.filter(msg => msg.active);
  
  // Reset to first message when active messages change
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeMessages.length]);
  
  // If no active messages, don't render anything
  if (activeMessages.length === 0 || isDismissed) {
    return null;
  }

  const currentMessage = activeMessages[currentIndex];
  
  // Default promotional message if none exists
  const promoContent = {
    title: "Boostez votre entreprise",
    subtitle: "Accédez à des outils puissants",
    cta: "Découvrez nos solutions"
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="w-full overflow-hidden mt-[72px] sm:mt-[80px] md:mt-[88px]" 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="relative py-3 px-4 sm:px-6 lg:px-8 overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #1a237e 0%, #0ea5e9 100%)'
          }}
        >
          {/* Subtle background abstract technology patterns */}
          <div className="absolute inset-0 overflow-hidden opacity-5">
            {/* Simplified circuit pattern */}
            <svg className="absolute h-full w-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,50 L90,50" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M50,10 L50,90" stroke="white" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="1.5" fill="white" />
              <circle cx="30" cy="30" r="1" fill="white" />
              <circle cx="70" cy="70" r="1" fill="white" />
            </svg>
            
            {/* Minimal floating particles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div 
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.4 + 0.1,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: Math.random() * 3 + 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Scrolling banner content */}
          <motion.div 
            className="relative z-10 max-w-5xl mx-auto"
            animate={{ x: ["100%", "-100%"] }}
            transition={{
              x: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }
            }}
          >
            <div className="flex items-center gap-3">
              {/* Text content with more subtle animations */}
              <div className="flex-1 text-white text-center whitespace-nowrap">
                <div className="flex flex-row items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium tracking-tight">{currentMessage.text || promoContent.title}</h3>
                    <p className="text-white/70 text-sm">{promoContent.subtitle}</p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button 
                      size="sm"
                      className="bg-white text-blue-900 hover:bg-blue-50 group text-sm"
                    >
                      {promoContent.cta}
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ 
                          duration: 1, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          repeatDelay: 1
                        }}
                      >
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </motion.div>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Image of person using device */}
              <div className="flex-shrink-0 w-28 md:w-32 hidden xs:block">
                <div className="relative rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="/lovable-uploads/8f046947-6e09-442a-88f9-2f82a0a50910.png" 
                    alt="Person using modern technology" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Close button */}
          <button 
            onClick={() => setIsDismissed(true)}
            className="absolute top-2 right-2 text-white/80 hover:text-white bg-black/10 p-1 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
