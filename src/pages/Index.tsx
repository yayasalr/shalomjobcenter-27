
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
  
  const placeholderImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", // Maison moderne
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // Maison élégante
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", // Logement lumineux
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", // Intérieur moderne
    "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800"  // Appartement contemporain
  ];

  const getValidImageUrl = (imageUrl: string, index: number) => {
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      return placeholderImages[index % placeholderImages.length];
    }
    return imageUrl;
  };

  useEffect(() => {
    if (!listings) return;
    
    const processedListings = listings.map((listing, index) => ({
      ...listing,
      image: getValidImageUrl(listing.image, index),
      images: listing.images ? 
        listing.images.map((img, imgIndex) => getValidImageUrl(img, index + imgIndex)) : 
        [getValidImageUrl(listing.image, index)]
    }));
    
    const shuffled = [...processedListings].sort(() => 0.5 - Math.random());
    // Augmenter le nombre de logements en vedette à 6 (ou moins si pas assez de logements)
    setFeaturedListings(shuffled.slice(0, Math.min(6, shuffled.length)));
    
    if (!searchTerm.trim()) {
      setFilteredListings(processedListings);
      setVisibleListings(processedListings.slice(0, 18)); // Afficher plus de logements initialement (3 rangées de 6)
    } else {
      const filtered = processedListings.filter(listing => 
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredListings(filtered);
      setVisibleListings(filtered);
    }
  }, [listings, searchTerm]);

  const formatPriceFCFA = (priceEUR: number): string => {
    const priceFCFA = Math.round(priceEUR * 655.957);
    return priceFCFA.toLocaleString('fr-FR');
  };

  const loadMoreListings = () => {
    if (visibleListings.length < filteredListings.length) {
      setVisibleListings(filteredListings.slice(0, visibleListings.length + 12)); // Charger 12 logements supplémentaires (2 rangées de 6)
    }
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <Navbar />
      
      <HeroSection />
      
      <div className="full-width-container">
        <div className="content-container py-10">
          <JobsBanner />
          
          {featuredListings.length > 0 && (
            <FeaturedListings 
              listings={featuredListings} 
              formatPriceFCFA={formatPriceFCFA} 
            />
          )}
        </div>
      </div>
      
      <div className="pt-4 w-full">
        <div className="content-container">
          <CategoryFiltersSimplified />
        </div>
        
        <div className="py-4 w-full">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            primaryColor={settings.primaryColor} 
          />

          <div className="content-container mt-4 mb-6">
            <h2 className="text-2xl font-medium text-sholom-dark elegant-title">
              {searchTerm 
                ? `Résultats pour "${searchTerm}"` 
                : "Logements en Afrique et partout dans le monde"}
            </h2>
            
            {searchTerm && (
              <p className="mb-4 text-sholom-muted minimal-text">
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
