
import React from 'react';
import { Heart } from 'lucide-react';
import { Listing } from '@/types/listing';
import { getFallbackImage } from './utils';

export interface ListingCardImageProps {
  imageUrl: string;
  title: string;
  isHovered: boolean;
  isFavorite: boolean;
  setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  fallbackImages: string[];
  listing?: Listing;
}

const ListingCardImage: React.FC<ListingCardImageProps> = ({
  imageUrl,
  title,
  isHovered,
  isFavorite,
  setIsFavorite,
  fallbackImages,
  listing
}) => {
  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const listingId = listing?.id;
    if (!listingId) return;

    // Get current favorites from localStorage
    const favorites = localStorage.getItem('favorites');
    let favList: string[] = [];
    
    if (favorites) {
      favList = JSON.parse(favorites);
    }
    
    // Toggle favorite status
    if (isFavorite) {
      favList = favList.filter(id => id !== listingId);
    } else {
      favList.push(listingId);
    }
    
    // Save updated favorites to localStorage
    localStorage.setItem('favorites', JSON.stringify(favList));
    setIsFavorite(!isFavorite);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const randomFallback = getFallbackImage(fallbackImages);
    e.currentTarget.src = randomFallback;
  };
  
  return (
    <div className="relative overflow-hidden aspect-square bg-gray-200 rounded-xl">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        onError={handleImageError}
      />
      
      {/* Heart icon for favorites */}
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm z-10 hover:bg-white transition-all"
        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart
          className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
        />
      </button>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default ListingCardImage;
