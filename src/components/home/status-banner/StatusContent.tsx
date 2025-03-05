
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusContentProps {
  message: string;
}

export const StatusContent: React.FC<StatusContentProps> = ({ message }) => {
  // Default promotional message content
  const promoContent = {
    title: "Boostez votre entreprise",
    subtitle: "Accédez à des outils puissants",
    cta: "Découvrez nos solutions"
  };

  return (
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
            {message || promoContent.title}
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
  );
};
