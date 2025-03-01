
import React from "react";
import { Listing } from "@/types/listing";
import SimilarListingCard from "./SimilarListingCard";

interface SimilarListingsProps {
  listings: Listing[];
  currentListingId: string;
  formatPriceFCFA: (price: number) => string;
}

const SimilarListings = ({ listings, currentListingId, formatPriceFCFA }: SimilarListingsProps) => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Logements similaires</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings
          .filter((item) => item.id !== currentListingId)
          .slice(0, 4)
          .map((item) => (
            <SimilarListingCard
              key={item.id}
              item={item}
              formatPriceFCFA={formatPriceFCFA}
            />
          ))}
      </div>
    </div>
  );
};

export default SimilarListings;
