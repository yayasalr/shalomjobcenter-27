
import React from 'react';
import { useListings } from '@/hooks/useListings';
import { Navbar } from '@/components/Navbar';
import { ListingCard } from '@/components/ListingCard';
import { CategoryFiltersSimplified } from '@/components/CategoryFiltersSimplified';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Index = () => {
  const { listings, isLoading } = useListings();
  const { settings } = useSiteSettings();
  
  // Exemples d'URLs d'images de remplacement fiables
  const placeholderImages = [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  // Fonction pour vérifier si une URL d'image est valide ou s'il s'agit d'une URL blob
  const getValidImageUrl = (imageUrl: string, index: number) => {
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      return placeholderImages[index % placeholderImages.length];
    }
    return imageUrl;
  };

  // Mapper les listings pour corriger les URLs d'images
  const processedListings = listings.map((listing, index) => ({
    ...listing,
    image: getValidImageUrl(listing.image, index),
    images: listing.images ? 
      listing.images.map((img, imgIndex) => getValidImageUrl(img, index + imgIndex)) : 
      [getValidImageUrl(listing.image, index)]
  }));

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

          <h1 className="text-3xl font-bold mb-6">{settings.siteName || "Logements disponibles"}</h1>
          
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
              {processedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pied de page avec les informations configurables */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo et informations de l'entreprise */}
            <div className="space-y-4">
              <img 
                src={settings.logo || "/placeholder.svg"} 
                alt={settings.siteName} 
                className="h-12 w-auto bg-white p-2 rounded"
              />
              <h3 className="text-xl font-bold">{settings.siteName}</h3>
              <p className="text-gray-400 text-sm">{settings.footer.about}</p>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="text-gray-400 space-y-2">
                <p>{settings.footer.contact}</p>
              </div>
            </div>
            
            {/* Informations légales */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Informations légales</h4>
              <div className="text-gray-400 space-y-2">
                <p>{settings.footer.terms}</p>
                <p>{settings.footer.policy}</p>
              </div>
            </div>
            
            {/* Réseaux sociaux */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646