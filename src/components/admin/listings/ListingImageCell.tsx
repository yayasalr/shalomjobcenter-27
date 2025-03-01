
import React from 'react';
import { Eye } from "lucide-react";
import { Listing } from '@/types/listing';
import { validateImage } from './utils/listingTableUtils';

interface ListingImageCellProps {
  listing: Listing;
  onShowDetails: (listing: Listing) => void;
}

export const ListingImageCell: React.FC<ListingImageCellProps> = ({
  listing,
  onShowDetails
}) => {
  return (
    <div 
      className="relative w-24 h-18 cursor-pointer group rounded-lg overflow-hidden aspect-[4/3] shadow-sm"
      onClick={() => onShowDetails(listing)}
    >
      <img
        src={validateImage(listing.image)}
        alt={listing.title}
        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg flex items-center justify-center">
        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};
