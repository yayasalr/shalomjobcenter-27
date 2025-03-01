
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PopularNeighborhoodsProps {
  setSearchTerm: (term: string) => void;
}

export const PopularNeighborhoods = ({ setSearchTerm }: PopularNeighborhoodsProps) => {
  const neighborhoods = ['Tokoin', 'Bè', 'Adidogomé', 'Agoè', 'Kodjoviakopé', 'Nyékonakpoè', 'Hédzranawoé', 'Baguida'];
  
  return (
    <div className="mt-16 mb-20 full-width">
      <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <h2 className="text-3xl font-serif font-bold text-sholom-dark mb-6">
          Quartiers populaires à Lomé
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
          {neighborhoods.map(neighborhood => (
            <Button 
              key={neighborhood}
              variant="outline"
              className="py-6 text-lg justify-start border-gray-200 hover:border-sholom-primary hover:bg-sholom-primary/5 transition-colors"
              onClick={() => setSearchTerm(neighborhood)}
            >
              <MapPin className="mr-2 h-5 w-5 text-sholom-primary" />
              {neighborhood}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
