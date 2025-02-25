
import React from 'react';
import { useListings } from '@/hooks/useListings';
import { Navbar } from '@/components/Navbar';
import { ListingCard } from '@/components/ListingCard';
import { CategoryFiltersSimplified } from '@/components/CategoryFiltersSimplified';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { listings, isLoading } = useListings();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        <CategoryFiltersSimplified />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Bannière pour les offres d'emploi */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg mb-10 shadow-md overflow-hidden">
            <div className="md:flex items-center">
              <div className="p-8 md:w-2/3">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Découvrez nos offres d'emploi
                </h2>
                <p className="text-blue-100 mb-6">
                  Des opportunités dans la sécurité et des logements exclusifs pour nos employés
                </p>
                <Link
                  to="/emplois"
                  className="inline-flex items-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-md shadow hover:bg-blue-50 transition"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Voir les offres
                </Link>
              </div>
              <div className="md:w-1/3 p-6 flex justify-center">
                <div className="bg-blue-700 p-6 rounded-full">
                  <Briefcase className="h-24 w-24 text-white" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-6">Logements disponibles</h1>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 animate-pulse rounded-lg h-64"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
