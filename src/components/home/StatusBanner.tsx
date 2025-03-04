
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
  }, [loadData]);

  // Filter active statuses
  const activeMessages = statusMessages.filter(msg => msg.active);
  
  // Reset to first message when active messages change
  useEffect(() => {
    setCurrentIndex(0);
    setIsDismissed(false);
  }, [activeMessages.length]);
  
  // If no active messages, don't render anything
  if (activeMessages.length === 0 || isDismissed) {
    return null;
  }

  const currentMessage = activeMessages[currentIndex];
  
  // Default promotional message if none exists
  const promoContent = {
    title: "Optimisez vos performances",
    subtitle: "Accédez à des outils puissants pour booster votre entreprise",
    cta: "Découvrez nos solutions"
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="w-full overflow-hidden mt-2" 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="relative py-6 px-4 sm:px-6 lg:px-8 overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #1a237e 0%, #0ea5e9 100%)'
          }}
        >
          {/* Background abstract technology patterns */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            {/* Circuit pattern effect */}
            <svg className="absolute h-full w-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,30 L90,30" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M10,50 L90,50" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M10,70 L90,70" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M30,10 L30,90" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M50,10 L50,90" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M70,10 L70,90" stroke="white" strokeWidth="0.5" fill="none" />
              <circle cx="30" cy="30" r="2" fill="white" />
              <circle cx="50" cy="50" r="2" fill="white" />
              <circle cx="70" cy="70" r="2" fill="white" />
              <circle cx="70" cy="30" r="2" fill="white" />
              <circle cx="30" cy="70" r="2" fill="white" />
            </svg>
            
            {/* Floating particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div 
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 5 + 2}px`,
                  height: `${Math.random() * 5 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.2,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Main content */}
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left: Text content with animations */}
              <div className="flex-1 text-white space-y-2 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-2xl font-bold tracking-tight">{currentMessage.text || promoContent.title}</h3>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <p className="text-white/80 max-w-xl">{promoContent.subtitle}</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Button 
                    className="mt-3 bg-white text-blue-900 hover:bg-blue-50 group"
                  >
                    {promoContent.cta}
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
              
              {/* Right: Image of person using device */}
              <motion.div 
                className="flex-shrink-0 w-full max-w-xs md:max-w-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src="/lovable-uploads/8f046947-6e09-442a-88f9-2f82a0a50910.png" 
                    alt="Person using modern technology" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent"></div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Close button */}
          <button 
            onClick={() => setIsDismissed(true)}
            className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
