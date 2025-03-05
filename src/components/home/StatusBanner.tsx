
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
        className="w-full overflow-hidden rounded-xl shadow-lg max-w-6xl mx-auto" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="relative p-4 sm:p-6 overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #1a237e 0%, #0ea5e9 100%)'
          }}
        >
          {/* Background abstract elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Circuit pattern */}
            <svg className="absolute h-full w-full opacity-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,30 L30,30 L30,10" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M70,10 L70,30 L90,30" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M90,70 L70,70 L70,90" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M30,90 L30,70 L10,70" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M0,50 L100,50" stroke="white" strokeWidth="0.2" fill="none" strokeDasharray="2,2" />
              <path d="M50,0 L50,100" stroke="white" strokeWidth="0.2" fill="none" strokeDasharray="2,2" />
              <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.3" fill="none" />
              <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.2" fill="none" strokeDasharray="1,1" />
            </svg>
            
            {/* Animated particles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div 
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, Math.random() * 10 - 5, 0],
                  opacity: [0.1, 0.5, 0.1],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Content wrapper */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {/* Text content column */}
            <div className="md:col-span-3 text-white space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {currentMessage.text || promoContent.title}
                  </h3>
                </div>
                
                <motion.p 
                  className="text-blue-100 text-sm max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {promoContent.subtitle}
                </motion.p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button 
                    size="sm"
                    className="bg-white text-blue-900 hover:bg-blue-50 group text-sm font-medium"
                  >
                    {promoContent.cta}
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        repeatDelay: 1
                      }}
                    >
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </motion.div>
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-blue-100 hover:text-white hover:bg-white/10 text-sm"
                  >
                    <LineChart className="h-3.5 w-3.5 mr-1.5" />
                    Voir les statistiques
                  </Button>
                </div>
              </motion.div>
            </div>
            
            {/* Image column */}
            <div className="md:col-span-2 relative">
              <motion.div
                className="relative z-10 rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-tr from-white/10 to-white/5 p-2">
                  <img 
                    src="/lovable-uploads/8f046947-6e09-442a-88f9-2f82a0a50910.png" 
                    alt="Innovation technologique" 
                    className="w-full h-auto object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent rounded-lg"></div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-3 -right-3 bg-yellow-400 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-blue-900 font-bold text-xs">NEW</span>
                </div>
              </motion.div>
              
              {/* Background decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-2xl opacity-20"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 blur-xl opacity-20"></div>
            </div>
          </div>
          
          {/* Close button */}
          <button 
            onClick={() => setIsDismissed(true)}
            className="absolute top-2 right-2 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
