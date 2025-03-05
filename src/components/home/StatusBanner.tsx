
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusMessage } from '@/components/admin/status/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { X, ArrowRight, Zap, LineChart } from 'lucide-react';
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
        className="w-full overflow-hidden rounded-lg shadow-md max-w-5xl mx-auto h-16 sm:h-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="relative flex items-center h-full overflow-hidden bg-white"
          style={{ 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
          }}
        >
          {/* Background abstract elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Abstract patterns */}
            <svg className="absolute h-full w-full opacity-5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,30 L30,30 L30,10" stroke="#888" strokeWidth="0.5" fill="none" />
              <path d="M70,10 L70,30 L90,30" stroke="#888" strokeWidth="0.5" fill="none" />
              <path d="M90,70 L70,70 L70,90" stroke="#888" strokeWidth="0.5" fill="none" />
              <path d="M30,90 L30,70 L10,70" stroke="#888" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="#888" strokeWidth="0.3" fill="none" />
              <circle cx="50" cy="50" r="20" stroke="#888" strokeWidth="0.2" fill="none" strokeDasharray="1,1" />
            </svg>
            
            {/* Dot patterns */}
            <div className="absolute top-0 left-0 w-full h-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-gray-300"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Scrolling content */}
          <div className="relative flex items-center w-full h-full px-4">
            <motion.div
              className="flex items-center gap-2 w-full"
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: "linear",
              }}
            >
              <div className="flex items-center space-x-3 flex-nowrap whitespace-nowrap">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-800 font-medium text-sm">
                    {currentMessage.text || promoContent.title}
                  </span>
                </div>
                
                <span className="text-gray-500 text-xs">•</span>
                
                <span className="text-gray-600 text-sm">
                  {promoContent.subtitle}
                </span>
                
                <span className="text-gray-500 text-xs">•</span>
                
                <Button 
                  size="sm"
                  variant="ghost"
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 py-1 h-8 text-xs font-medium"
                >
                  {promoContent.cta}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
                
                <span className="text-gray-500 text-xs">•</span>
                
                <div className="flex items-center">
                  <LineChart className="h-3 w-3 text-gray-600 mr-1" />
                  <span className="text-gray-600 text-sm">Statistiques</span>
                </div>
                
                <span className="text-gray-500 text-xs">•</span>
                
                <div className="flex items-center">
                  <img 
                    src="/lovable-uploads/8f046947-6e09-442a-88f9-2f82a0a50910.png" 
                    alt="Innovation" 
                    className="h-6 w-6 object-cover rounded"
                  />
                  <span className="text-gray-700 text-sm ml-2">Nouvelle fonctionnalité</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Close button */}
          <button 
            onClick={() => setIsDismissed(true)}
            className="absolute right-2 text-gray-400 hover:text-gray-600 bg-white/90 p-1 rounded-full z-10 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
