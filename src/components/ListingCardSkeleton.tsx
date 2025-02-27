
import React from 'react';

export const ListingCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200 shimmer"></div>
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full shimmer"></div>
          <div className="h-4 w-32 bg-gray-200 rounded shimmer"></div>
        </div>
        <div className="h-5 w-full bg-gray-200 rounded shimmer"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded shimmer"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-200 rounded shimmer"></div>
          <div className="h-6 w-10 bg-gray-200 rounded shimmer"></div>
        </div>
      </div>
    </div>
  );
};
