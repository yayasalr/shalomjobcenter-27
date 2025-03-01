
import React from 'react';
import { Listing } from '@/types/listing';

interface FeaturedListingsProps {
  listings: Listing[];
  formatPriceFCFA: (price: number) => string;
}

export const FeaturedListings = ({ listings, formatPriceFCFA }: FeaturedListingsProps) => {
  return null;
};
