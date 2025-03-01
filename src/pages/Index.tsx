
import React, { useEffect, useState } from 'react';
import { useListings } from '@/hooks/useListings';
import { Navbar } from '@/components/Navbar';
import { CategoryFiltersSimplified } from '@/components/CategoryFiltersSimplified';
import { Listing } from '@/types/listing';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { HeroSection } from '@/components/home/HeroSection';
import { JobsBanner } from '@/components/home/JobsBanner';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { SearchBar } from '@/components/home/SearchBar';
import { ListingsGrid } from '@/components/home/ListingsGrid';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { PopularNeighborhoods } from '@/components/home/PopularNeighborhoods';
import { Footer } from '@/components/home/Footer';

const Index = () => {
  const { listings, isLoading } = useListings();
  const { settings } = useSiteSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [visibleListings, setVisibleListings] = useState<Listing[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  
  // Exemples d'URLs d'images de remplacement fiables
  const placeholderImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", // Maison moderne
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // Maison élégante
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", // Logement lumineux
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", // Intérieur moderne
    "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800"  // Appartement contemporain
  ];

  // Fonction pour vérifier si une URL d'image est valide ou s'il s'agit d'une URL blob
  const getValidImageUrl = (imageUrl: string, index: number) => {
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      return placeholderImages[index % placeholderImages.length];
    }
    return imageUrl;
  };

  // Filtrer les listings en fonction du terme de recherche
  useEffect(() => {
    if (!listings) return;
    
    // Processus des images valides pour tous les listings
    const processedListings = listings.map((listing, index) => ({
      ...listing,
      image: getValidImageUrl(listing.image, index),
      images: listing.images ? 
        listing.images.map((img, imgIndex) => getValidImageUrl(img, index + imgIndex)) : 
        [getValidImageUrl(listing.image, index)]
    }));
    
    // Sélectionner quelques listings aléatoires comme "en vedette"
    const shuffled = [...processedListings].sort(() => 0.5 - Math.random());
    setFeaturedListings(shuffled.slice(0, 3));
    
    if (!searchTerm.trim()) {
      // Si aucun terme de recherche, afficher tous les listings
      setFilteredListings(processedListings);
      setVisibleListings(processedListings.slice(0, 8)); // Afficher 8 premiers par défaut pour mieux s'adapter aux écrans larges
    } else {
      // Filtrer par terme de recherche
      const filtered = processedListings.filter(listing => 
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredListings(filtered);
      setVisibleListings(filtered);
    }
  }, [listings, searchTerm]);

  // Affichage du prix en FCFA
  const formatPriceFCFA = (priceEUR: number): string => {
    const priceFCFA = Math.round(priceEUR * 655.957);
    return priceFCFA.toLocaleString('fr-FR');
  };

  // Charger plus de logements
  const loadMoreListings = () => {
    if (visibleListings.length < filteredListings.length) {
      setVisibleListings(filteredListings.slice(0, visibleListings.length + 4)); // Charger 4 de plus
    }
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <Navbar />
      
      <HeroSection />
      
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 mx-auto py-12">
        <JobsBanner />
        
        {featuredListings.length > 0 && (
          <FeaturedListings 
            listings={featuredListings} 
            formatPriceFCFA={formatPriceFCFA} 
          />
        )}
      </div>
      
      <div className="pt-6 w-full">
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 mx-auto">
          <CategoryFiltersSimplified />
        </div>
        
        <div className="py-4 w-full">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            primaryColor={settings.primaryColor} 
          />

          <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 mt-4">
            <h2 className="text-2xl font-medium text-sholom-dark">
              {searchTerm 
                ? `Résultats pour "${searchTerm}"` 
                : "Logements en Afrique et partout dans le monde"}
            </h2>
            
            {/* Affichage des résultats de recherche */}
            {searchTerm && (
              <p className="mb-4 text-sholom-muted">
                {filteredListings.length} résultat(s) trouvé(s)
              </p>
            )}
          </div>
          
          <ListingsGrid 
            isLoading={isLoading}
            visibleListings={visibleListings}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredListings={filteredListings}
            loadMoreListings={loadMoreListings}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
