
import React from 'react';
import { useListingQueries } from '@/hooks/useListingQueries';
import { ListingCard } from '@/components/listing-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Listings = () => {
  const { listings, isLoading, error } = useListingQueries();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Chargement des logements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 max-w-md w-full">
          <p className="font-bold">Erreur</p>
          <p>{error.message}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Réessayer
        </button>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Aucun logement disponible</h2>
        <p className="text-gray-600 mb-8">Aucun logement n'a été trouvé. Veuillez réessayer ultérieurement.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Nos logements</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default Listings;
