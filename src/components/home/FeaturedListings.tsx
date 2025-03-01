
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { Listing } from '@/types/listing';
import { FALLBACK_IMAGES } from '@/constants/images';

interface FeaturedListingsProps {
  listings: Listing[];
  formatPriceFCFA: (price: number) => string;
}

export const FeaturedListings = ({ listings, formatPriceFCFA }: FeaturedListingsProps) => {
  if (listings.length === 0) {
    return null;
  }

  // Fonction pour obtenir une image valide
  const getValidImage = (listing: Listing): string => {
    // Si le listing a des images valides, utiliser la première
    if (listing.images && listing.images.length > 0 && listing.images[0]) {
      return listing.images[0];
    }
    
    // Si le listing a une image principale valide, l'utiliser
    if (listing.image && !listing.image.startsWith('blob:')) {
      return listing.image;
    }
    
    // Sinon, utiliser une image de secours
    return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  };

  // Extraction du quartier depuis la localisation
  const getNeighborhood = (location: string): string => {
    return location.split(',')[0].trim();
  };

  return (
    <div className="mb-16 w-full">
      <div className="flex items-center justify-between mb-8 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <h2 className="text-3xl font-bold text-sholom-dark">
          En vedette
        </h2>
        <Link 
          to="#all-listings" 
          className="text-sholom-primary hover:text-sholom-primary/80 flex items-center"
        >
          Voir tout
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="featured-grid">
        {listings.map((listing) => (
          <Link 
            key={listing.id} 
            to={`/logement/${listing.id}`}
            className="group relative rounded-xl overflow-hidden shadow-md hover-lift hover-shadow transition-all"
          >
            <div className="relative aspect-[16/9]">
              <img
                src={getValidImage(listing)}
                alt={listing.title}
                className="featured-listing-image transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  console.log("Erreur de chargement d'image pour:", listing.title);
                  e.currentTarget.src = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
              <div className="absolute top-4 left-4 bg-white text-black text-sm font-semibold rounded-full px-3 py-1">
                En vedette
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl text-white font-bold mb-1">
                  {listing.title}
                </h3>
                <div className="flex items-center text-white/90 mb-2">
                  <MapPin className="h-4 w-4 mr-1" /> 
                  {getNeighborhood(listing.location)}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-white">
                    <span className="text-lg font-bold">{formatPriceFCFA(listing.price)} FCFA</span> / nuit
                  </div>
                  <div className="flex items-center bg-yellow-500 rounded-md px-2 py-1">
                    <Star className="h-4 w-4 text-white fill-white mr-1" />
                    <span className="text-white font-medium">{listing.rating || "Nouveau"}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
