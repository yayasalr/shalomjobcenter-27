<lov-code>
import React, { useEffect, useState } from 'react';
import { useListings } from '@/hooks/useListings';
import { Navbar } from '@/components/Navbar';
import { ListingCard } from '@/components/ListingCard';
import { CategoryFiltersSimplified } from '@/components/CategoryFiltersSimplified';
import { Briefcase, Search, MapPin, Star, ArrowRight, CheckCircle, Home, Building, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Listing } from '@/types/listing';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
      setVisibleListings(processedListings.slice(0, 8)); // Afficher seulement les 8 premiers par défaut
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
      setVisibleListings(filteredListings.slice(0, visibleListings.length + 4));
    }
  };

  // Animation variants pour framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sholom-light to-blue-50 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-sholom-dark leading-tight">
                Découvrez votre nouveau <span className="text-sholom-primary italic">chez-vous</span> à Lomé
              </h1>
              <p className="text-xl text-sholom-muted max-w-2xl">
                Des logements premium et des opportunités d'emploi exclusives dans les meilleurs quartiers de Lomé pour une expérience de vie supérieure.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-sholom-primary hover:bg-sholom-primary/90 text-white font-medium"
                >
                  Trouver un logement
                </Button>
                <Link to="/emplois">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="font-medium"
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    Offres d'emploi
                  </Button>
                </Link>
              </div>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                {[
                  { icon: <Home className="h-5 w-5" />, text: "Logements vérifiés" },
                  { icon: <Shield className="h-5 w-5" />, text: "Paiements sécurisés" },
                  { icon: <Building className="h-5 w-5" />, text: "Support local 24/7" }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sholom-dark">
                    <div className="text-sholom-primary">{benefit.icon}</div>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-sholom-accent/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-sholom-primary/20 rounded-full blur-2xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800" 
                  alt="Logement premium" 
                  className="w-full h-auto object-cover rounded-2xl hover-scale"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center text-white gap-4">
                    <div>
                      <p className="text-lg font-medium">Villa Premium à Lomé</p>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Tokoin, Lomé</span>
                      </div>
                    </div>
                    <div className="ml-auto bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                      <span className="font-semibold">1.200.000 FCFA</span> / mois
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <CategoryFiltersSimplified />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Bannière pour les offres d'emploi */}
          <div className="rounded-2xl overflow-hidden shadow-lg mb-16">
            <div 
              className="bg-gradient-to-r p-0.5 from-sholom-primary to-sholom-secondary"
            >
              <div className="bg-white dark:bg-gray-900 rounded-[inherit] p-px">
                <div className="rounded-[inherit] bg-gradient-to-r from-sholom-primary to-sholom-secondary overflow-hidden">
                  <div className="md:flex items-center">
                    <div className="p-8 md:w-2/3">
                      <h2 className="text-3xl font-serif font-bold text-white mb-4">
                        Découvrez nos offres d'emploi
                      </h2>
                      <p className="text-white/80 mb-6 text-lg">
                        Des opportunités dans la sécurité et des logements exclusifs pour nos employés
                      </p>
                      <Link
                        to="/emplois"
                        className="inline-flex items-center bg-white text-sholom-primary font-semibold px-6 py-3 rounded-md shadow hover:bg-blue-50 transition-all group"
                      >
                        <Briefcase className="mr-2 h-5 w-5" />
                        Voir les offres
                        <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                    <div className="md:w-1/3 p-6 flex justify-center">
                      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                        <Briefcase className="h-24 w-24 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logements en vedette */}
          {featuredListings.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold text-sholom-dark">
                  En vedette
                </h2>
                <Link 
                  to="#all-listings" 
                  className="text-sholom-primary hover:text-sholom-primary/80 flex items-center"
                >
                  Voir tout
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredListings.map((listing, index) => (
                  <div 
                    key={listing.id} 
                    className="group relative rounded-xl overflow-hidden shadow-lg hover-lift hover-shadow"
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
                      <div className="absolute top-4 left-4 bg-sholom-accent text-white text-sm font-semibold rounded-full px-3 py-1">
                        En vedette
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl text-white font-bold mb-1">
                          {listing.title}
                        </h3>
                        <div className="flex items-center text-white/90 mb-2">
                          <MapPin className="h-4 w-4 mr-1" /> 
                          {listing.location}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-white">
                            <span className="text-lg font-bold">{formatPriceFCFA(listing.price)} FCFA</span> / nuit
                          </div>
                          <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-md px-2 py-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-white">{listing.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barre de recherche */}
          <div id="all-listings" className="sticky top-20 z-10 bg-white py-4 border-b mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher par quartier, titre..."
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  style={{ 
                    borderColor: settings.primaryColor,
                    boxShadow: `0 0 0 0px ${settings.primaryColor}`
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {searchTerm && (
                <Button 
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  Effacer la recherche
                </Button>
              )}
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-sholom-dark mb-6">
            {searchTerm 
              ? `Résultats pour "${searchTerm}"` 
              : settings.siteName || "Tous nos logements"}
          </h2>
          
          {/* Affichage des résultats de recherche */}
          {searchTerm && (
            <p className="mb-6 text-sholom-muted">
              {filteredListings.length} résultat(s) trouvé(s)
            </p>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 animate-pulse rounded-lg h-72 shimmer"
                ></div>
              ))}
            </div>
          ) : visibleListings.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {visibleListings.map((listing) => (
                <motion.div key={listing.id} variants={itemVariants}>
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-xl text-gray-500 mb-4">Aucun logement ne correspond à votre recherche</p>
              {searchTerm && (
                <Button 
                  onClick={() => setSearchTerm("")}
                  className="mt-2 bg-sholom-primary hover:bg-sholom-primary/90"
                >
                  Voir tous les logements
                </Button>
              )}
            </div>
          )}
          
          {/* Bouton "Voir plus" */}
          {!searchTerm && visibleListings.length < filteredListings.length && (
            <div className="flex justify-center mt-10">
              <Button 
                onClick={loadMoreListings}
                variant="outline"
                className="border-sholom-primary text-sholom-primary hover:bg-sholom-primary/10"
              >
                Voir plus de logements
              </Button>
            </div>
          )}
          
          {/* Pourquoi choisir Sholom */}
          <div className="mt-24 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-sholom-dark mb-4">
                Pourquoi choisir Sholom ?
              </h2>
              <p className="text-sholom-muted text-lg max-w-2xl mx-auto">
                Nous nous distinguons par notre engagement à offrir des services de qualité supérieure
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Home className="h-8 w-8" />,
                  title: "Logements Premium",
                  description: "Tous nos logements sont vérifiés et répondent à des standards de qualité élevés"
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "Sécurité Garantie",
                  description: "Nous offrons des services de sécurité 24/7 pour tous nos clients"
                },
                {
                  icon: <CheckCircle className="h-8 w-8" />,
                  title: "Service Client Exceptionnel",
                  description: "Notre équipe est disponible pour vous accompagner à chaque étape"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover-shadow transition-all flex flex-col items-center text-center"
                >
                  <div className="bg-sholom-primary/10 text-sholom-primary p-3 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-sholom-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sholom-muted">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Liste des quartiers populaires */}
          <div className="mt-16 mb-20">
            <h2 className="text-3xl font-serif font-bold text-sholom-dark mb-6">
              Quartiers populaires à Lomé
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Tokoin', 'Bè', 'Adidogomé', 'Agoè', 'Kodjoviakopé', 'Nyékonakpoè', 'Hédzranawoé', 'Baguida'].map(neighborhood => (
                <Button 
                  key={neighborhood}
                  variant="outline"
                  className="py-6 text-lg justify-start border-gray-200 hover:border-sholom-primary hover:bg-sholom-primary/5 transition-colors"
                  onClick={() => setSearchTerm(neighborhood)}
                >
                  <MapPin className="mr-2 h-5 w-5 text-sholom-primary" />
                  {neighborhood}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page avec les informations configurables */}
      <footer className="bg-sholom-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo et informations de l'entreprise */}
            <div className="space-y-4">
              <img 
                src={settings.logo || "/placeholder.svg"} 
                alt={settings.siteName} 
                className="h-12 w-auto bg-white p-2 rounded"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <h3 className="text-xl font-bold">{settings.siteName}</h3>
              <p className="text-gray-400 text-sm">{settings.footer.about}</p>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="text-gray-400 space-y-2">
                <p>{settings.footer.contact}</p>
                {settings.companyInfo && (
                  <>
                    <p>{settings.companyInfo.address}</p>
                    <p>{settings.companyInfo.phone}</p>
                    <p>{settings.companyInfo.email}</p>
                  </>
                )}
              </div>
            </div>
            
            {/* Informations légales */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Informations légales</h4>
              <div className="text-gray-400 space-y-2">
                <p>{settings.footer.terms}</p>
                <p>{settings.footer.policy}</p>
                {settings.companyInfo && (
                  <p>RCCM: {settings.companyInfo.registrationNumber}</p>
                )}
              </div>
            </div>
            
            {/* Réseaux sociaux */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text
