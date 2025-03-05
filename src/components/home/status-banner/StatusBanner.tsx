
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStatusMessages } from './useStatusMessages';
import { StatusContent } from './StatusContent';
import { BannerBackground } from './BannerBackground';
import { CloseButton } from './CloseButton';

export const StatusBanner: React.FC = () => {
  const { 
    activeMessages, 
    currentIndex, 
    isDismissed, 
    setIsDismissed 
  } = useStatusMessages();
  
  // If no active messages, don't render anything
  if (activeMessages.length === 0 || isDismissed) {
    return null;
  }

  const currentMessage = activeMessages[currentIndex];
  
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
          <BannerBackground />
          
          {/* Scrolling content */}
          <div className="relative flex items-center w-full h-full px-4">
            <StatusContent message={currentMessage.text} />
          </div>
          
          {/* Close button */}
          <CloseButton onClose={() => setIsDismissed(true)} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
