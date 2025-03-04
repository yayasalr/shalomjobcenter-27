
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusMessage } from '@/components/admin/status/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { X } from 'lucide-react';

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
  
  // Get icon based on message type
  const getIcon = () => {
    switch (currentMessage.type) {
      case 'announcement':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-megaphone"><path d="m3 11 18-5v12L3 13"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
        );
      case 'promotion':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-template"><rect width="18" height="7" x="3" y="3" rx="1"></rect><rect width="9" height="7" x="3" y="14" rx="1"></rect><rect width="5" height="7" x="16" y="14" rx="1"></rect></svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
        );
      case 'alert':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
        );
      default:
        return null;
    }
  };

  // Handle clicking "Next" if there are multiple messages
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === activeMessages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="w-full overflow-hidden mt-16 sm:mt-20" // Added margin-top to position below navbar
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="relative flex items-center px-4 py-3 overflow-hidden shadow-md"
          style={{ 
            backgroundColor: currentMessage.backgroundColor || '#f97316',
            color: currentMessage.textColor || '#ffffff'
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -inset-1 blur-xl">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 100 + 50}px`,
                    height: `${Math.random() * 100 + 50}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: 'currentColor',
                    opacity: 0.2,
                    transform: `scale(${Math.random() * 2 + 0.5})`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Content with scrolling animation */}
          <div className="relative z-10 w-full max-w-7xl mx-auto overflow-hidden">
            <motion.div
              className="flex items-center"
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear"
                }
              }}
            >
              <div className="flex items-center gap-3 whitespace-nowrap">
                <div className="flex-shrink-0">
                  {getIcon()}
                </div>
                
                <p className="font-medium">
                  {currentMessage.text}
                </p>
                
                {currentMessage.imageUrl && (
                  <div className="h-10 w-16 rounded overflow-hidden flex-shrink-0 hidden sm:block">
                    <img 
                      src={currentMessage.imageUrl} 
                      alt="Status" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Close button - positioned absolutely to not interfere with scrolling text */}
          <div className="absolute right-4 z-20">
            <button 
              onClick={() => setIsDismissed(true)}
              className="hover:opacity-80 transition-opacity bg-black/20 rounded-full p-1"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
