
import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface CompareListingCardProps {
  listing: any;
  onRemove: () => void;
}

export const CompareListingCard: React.FC<CompareListingCardProps> = ({ listing, onRemove }) => {
  const formatPriceFCFA = (priceEUR: number): string => {
    const priceFCFA = Math.round(priceEUR * 655.957);
    return priceFCFA.toLocaleString('fr-FR');
  };

  return (
    <motion.div 
      className="relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover-shadow transition-all"
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
    >
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 z-10 hover:bg-red-500 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
      <Link to={`/logement/${listing.id}`} className="flex flex-col h-full">
        <div className="relative h-32">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center justify-between text-white">
              <div className="text-sm truncate font-medium">{listing.title}</div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5 text-xs">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-0.5" />
                {listing.rating || "N/A"}
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 flex-grow flex flex-col">
          <div className="flex items-center text-sholom-muted text-xs mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            {listing.location}
          </div>
          <div className="mt-auto pt-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-sholom-primary">
              {formatPriceFCFA(listing.price)} FCFA
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto text-xs text-sholom-muted hover:text-sholom-primary flex items-center"
            >
              Détails <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
