
import React from "react";
import { Heart } from "lucide-react";
import { Listing } from "@/types/listing";
import { getFallbackImage } from "./utils";

interface ListingCardImageProps {
  listing: Listing;
  imageUrl: string;
  title: string;
  isHovered: boolean;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  fallbackImages: string[];
}

export const ListingCardImage = ({
  listing,
  imageUrl,
  title,
  isHovered,
  isFavorite,
  setIsFavorite,
  fallbackImages,
}: ListingCardImageProps) => {
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== listing.id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } else {
      favorites.push(listing.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="relative overflow-hidden rounded-xl aspect-[16/9] mb-3">
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          console.log("Image load error for:", title);
          e.currentTarget.src = getFallbackImage(fallbackImages);
        }}
      />
      
      {/* Favorite heart button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md z-10 transition-opacity"
        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
          }`}
        />
      </button>
      
      {/* Image navigation dots for listings with multiple images */}
      {listing.images && listing.images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {listing.images.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                isHovered && index === 0
                  ? "w-6 bg-white"
                  : "bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
