
import React from "react";
import { Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagicBook } from "@/components/ui/magic-book";

interface ListingCardImageProps {
  image?: string;
  alt: string;
  rating?: number;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  className?: string;
}

// Modify the component to include the MagicBook at the bottom left
const ListingCardImage: React.FC<ListingCardImageProps> = ({
  image,
  alt,
  rating,
  isFavorite,
  onFavoriteToggle,
  className,
}) => {
  const fallbackImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";

  return (
    <div className={cn("relative rounded-t-lg overflow-hidden", className)}>
      <div className="relative aspect-[16/9] w-full h-48 bg-gray-200">
        <img
          src={image || fallbackImage}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        
        {/* Action buttons at top */}
        <div className="absolute top-2 right-2 flex space-x-1">
          {onFavoriteToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavoriteToggle();
              }}
              className="p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <Heart
                size={18}
                className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}
              />
            </button>
          )}
          
          <button
            onClick={(e) => e.preventDefault()}
            className="p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Eye size={18} className="text-gray-600" />
          </button>
        </div>
        
        {/* Rating badge if available */}
        {rating && (
          <div className="absolute top-2 left-2 bg-white/80 px-2 py-0.5 rounded text-sm font-medium">
            {rating.toFixed(1)} ★
          </div>
        )}
        
        {/* MagicBook component */}
        <MagicBook 
          position="bottom-left"
          className="scale-75 opacity-85 hover:opacity-100"
        />
      </div>
    </div>
  );
};

export default ListingCardImage;
