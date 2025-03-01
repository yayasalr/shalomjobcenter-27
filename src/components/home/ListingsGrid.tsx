
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listing-card';
import { Listing } from '@/types/listing';
import { Card } from '@/components/ui/card';

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
      <div className="w-full px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, index) => (
            <Card key={index} className="overflow-hidden hover-shadow transition duration-300">
              <div className="bg-gray-200 animate-pulse aspect-square relative shimmer"></div>
              <div className="p-2">
                <div className="h-5 w-3/4 bg-gray-200 animate-pulse shimmer mb-1"></div>
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
      <div className="w-full px-4 py-4">
        <div className="text-center py-8 border border-dashed rounded-lg bg-white">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-gray-100">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-lg text-gray-500 mb-3 minimal-text">Aucun logement ne correspond à votre recherche</p>
          {searchTerm && (
            <Button 
              onClick={() => setSearchTerm("")}
              className="mt-1 bg-sholom-primary text-white hover:bg-sholom-primary-dark font-medium"
            >
              Voir tous les logements
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
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
      
      {/* "Voir plus" button avec meilleure visibilité */}
      {!searchTerm && visibleListings.length < filteredListings.length && (
        <div className="flex justify-center mt-8 mb-6">
          <Button 
            onClick={loadMoreListings}
            className="bg-sholom-primary text-white hover:bg-sholom-primary-dark text-lg px-6 py-4 shadow-md font-medium"
          >
            Voir plus de logements
          </Button>
        </div>
      )}
    </div>
  );
};
