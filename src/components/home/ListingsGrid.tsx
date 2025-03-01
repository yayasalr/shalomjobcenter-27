
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listing-card';
import { Listing } from '@/types/listing';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ListingsGridProps {
  isLoading: boolean;
  visibleListings: Listing[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredListings: Listing[];
  loadMoreListings: () => void;
}

export const ListingsGrid = ({
  isLoading,
  visibleListings,
  searchTerm,
  setSearchTerm,
  filteredListings,
  loadMoreListings
}: ListingsGridProps) => {
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto max-w-[2520px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-20 2xl:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, index) => (
            <Card key={index} className="overflow-hidden hover-shadow transition duration-300">
              <div className="bg-gray-200 animate-pulse h-72 shimmer"></div>
              <div className="p-4">
                <div className="h-5 w-3/4 bg-gray-200 animate-pulse shimmer mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse shimmer"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (visibleListings.length === 0) {
    return (
      <div className="w-full mx-auto max-w-[2520px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-20 2xl:px-24">
        <div className="text-center py-16 border border-dashed rounded-lg bg-white">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-xl text-gray-500 mb-4">Aucun logement ne correspond à votre recherche</p>
          {searchTerm && (
            <Button 
              onClick={() => setSearchTerm("")}
              className="mt-2 bg-sholom-primary hover:bg-sholom-primary/90"
            >
              Voir tous les logements
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-[2520px]">
      <motion.div 
        className="airbnb-grid px-4 sm:px-6 md:px-8 lg:px-10 xl:px-20 2xl:px-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {visibleListings.map((listing) => (
          <motion.div key={listing.id} variants={itemVariants} layout className="hover-lift">
            <ListingCard listing={listing} />
          </motion.div>
        ))}
      </motion.div>
      
      {/* "Voir plus" button */}
      {!searchTerm && visibleListings.length < filteredListings.length && (
        <div className="flex justify-center mt-16 mb-12">
          <Button 
            onClick={loadMoreListings}
            variant="outline"
            className="border-sholom-primary text-sholom-primary hover:bg-sholom-primary/10 text-lg px-8 py-6"
          >
            Voir plus de logements
          </Button>
        </div>
      )}
    </div>
  );
};
