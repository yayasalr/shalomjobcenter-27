
import React from 'react';
import { Link } from 'react-router-dom';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CompareListingCard } from './CompareListingCard';
import { EmptyCompareSlot } from './EmptyCompareSlot';

interface ComparePanelProps {
  compareListings: any[];
  removeListing: (id: string) => void;
  clearComparison: () => void;
}

export const ComparePanel: React.FC<ComparePanelProps> = ({ 
  compareListings,
  removeListing, 
  clearComparison
}) => {
  const containerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 500 }
    },
    exit: { 
      y: 100, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="compare-panel"
        className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <GitCompare className="h-5 w-5 text-sholom-primary mr-2" />
              <h3 className="text-lg font-semibold">
                Comparer ({compareListings.length} logement{compareListings.length > 1 ? 's' : ''})
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearComparison}
                className="text-sholom-muted hover:text-red-500"
              >
                Vider
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.dispatchEvent(new Event('storage'))}
                className="text-sholom-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {compareListings.map((listing) => (
              <CompareListingCard 
                key={listing.id} 
                listing={listing} 
                onRemove={() => removeListing(listing.id)} 
              />
            ))}
            
            {Array.from({ length: 4 - compareListings.length }).map((_, index) => (
              <EmptyCompareSlot key={`empty-${index}`} />
            ))}
          </div>
          
          {compareListings.length > 1 && (
            <div className="flex justify-center mt-4">
              <Link to="/compare">
                <Button className="bg-sholom-primary hover:bg-sholom-primary/90">
                  Comparer en détail
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
