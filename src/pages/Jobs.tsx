
import React, { useState, useEffect } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { Navbar } from '@/components/Navbar';
import { JobFilters } from '@/components/jobs/JobFilters';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Job } from '@/types/job';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BriefcaseBusiness, 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  Home, 
  Building, 
  CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Jobs = () => {
  const { jobs, isLoading } = useJobs();
  const { settings } = useSiteSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [showHousingOnly, setShowHousingOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Animation variants for framer-motion
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

  // Filtrer les offres d'emploi selon les critères
  useEffect(() => {
    if (!jobs) return;
    
    setFilteredJobs(
      jobs.filter((job) => {
        // Filtrer par terme de recherche
        const searchMatch = 
          !searchTerm || 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase());
          
        // Filtrer par domaine
        const domainMatch = domainFilter === 'all' || job.domain === domainFilter;
        
        // Filtrer par type d'offre (emploi ou logement)
        const typeMatch = !showHousingOnly || job.isHousingOffer;
        
        return searchMatch && domainMatch && typeMatch;
      })
    );
  }, [jobs, searchTerm, domainFilter, showHousingOnly]);
  
  // Formatage de la date de publication
  const formatPublishDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "Aujourd'hui";
    if (diffDays <= 2) return "Hier";
    if (diffDays <= 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Fonction pour obtenir l'image selon le domaine
  const getDomainImage = (domain: string) => {
    switch(domain) {
      case 'residential_security':
        return 'https://images.unsplash.com/photo-1564182842519-8a3b2af3e228?q=80&w=786&auto=format&fit=crop';
      case 'bodyguard':
        return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=774&auto=format&fit=crop';
      case 'private_property':
        return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=773&auto=format&fit=crop';
      case 'industrial_security':
        return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop';
      case 'housing_offer':
        return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=870&auto=format&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=2070&auto=format&fit=crop';
    }
  };
  
  // Traduction du domaine
  const translateDomain = (domain: string) => {
    const domains: {[key: string]: string} = {
      'residential_security': 'Sécurité résidentielle',
      'bodyguard': 'Garde du corps',
      'private_property': 'Propriétés privées',
      'industrial_security': 'Sécurité industrielle',
      'office_security': 'Sécurité de bureau',
      'event_security': 'Sécurité événementielle',
      'k9_security': 'Maître-chien',
      'housing_offer': 'Offre de logement'
    };
    
    return domains[domain] || domain;
  };
  
  // Type de contrat
  const translateContract = (contract: string) => {
    const contracts: {[key: string]: string} = {
      'full_time': 'CDI',
      'part_time': 'Temps partiel',
      'contract': 'CDD'
    };
    
    return contracts[contract] || contract;
  };
  
  // Affichage du prix en FCFA
  const formatPriceFCFA = (priceEUR: number): string => {
    const priceFCFA = Math.round(priceEUR * 655.957);
    return priceFCFA.toLocaleString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sholom-light to-blue-50 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-sholom-dark leading-tight">
                Trouvez votre <span className="text-sholom-primary italic">carrière</span> à Lomé
              </h1>
              <p className="text-xl text-sholom-muted max-w-2xl">
                Des opportunités professionnelles dans la sécurité et des logements exclusifs pour nos employés dans toute la ville de Lomé.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-sholom-primary hover:bg-sholom-primary/90 text-white font-medium"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-5 w-5" />
                  Filtrer les offres
                </Button>
                <Link to="/">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="font-medium"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Voir les logements
                  </Button>
                </Link>
              </div>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                {[
                  { icon: <BriefcaseBusiness className="h-5 w-5" />, text: "Carrières stables" },
                  { icon: <Building className="h-5 w-5" />, text: "Logements inclus" },
                  { icon: <CheckCircle className="h-5 w-5" />, text: "Formations continues" }
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
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1170&auto=format&fit=crop" 
                  alt="Carrière dans la sécurité" 
                  className="w-full h-auto object-cover rounded-2xl hover-scale"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center text-white gap-4">
                    <div>
                      <p className="text-lg font-medium">Agent de sécurité premium</p>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Tokoin, Lomé</span>
                      </div>
                    </div>
                    <div className="ml-auto bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                      <span className="font-semibold">Dès aujourd'hui</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Barre de recherche et filtres */}
        <div className="sticky top-20 z-10 bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un poste, un lieu..."
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                style={{ 
                  borderColor: settings.primaryColor,
                  boxShadow: `0 0 0 0px ${settings.primaryColor}`
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="whitespace-nowrap flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
              </Button>
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
          
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <JobFilters 
                onDomainChange={setDomainFilter} 
                onHousingChange={setShowHousingOnly} 
                currentDomain={domainFilter}
                showHousingOnly={showHousingOnly}
              />
            </motion.div>
          )}
        </div>
        
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-serif font-bold text-sholom-dark">
            {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} disponible{filteredJobs.length > 1 ? 's' : ''}
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`${showHousingOnly ? 'bg-sholom-primary/10 text-sholom-primary' : ''}`}
              onClick={() => setShowHousingOnly(!showHousingOnly)}
            >
              <Home className={`h-4 w-4 mr-2 ${showHousingOnly ? 'text-sholom-primary' : ''}`} />
              Logements
            </Button>
          </div>
        </div>
        
        {/* Résultats de recherche */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-gray-200 h-16 w-16"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 h-10 bg-gray-200 rounded"></div>
                <div className="mt-4 flex justify-between">
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredJobs.map((job) => (
              <motion.div 
                key={job.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover-shadow transition-all duration-300 group"
                variants={itemVariants}
              >
                <Link to={`/emploi/${job.id}`} className="block p-0">
                  <div className="lg:flex">
                    {/* Image représentative du poste */}
                    <div className="lg:w-1/4 h-48 lg:h-auto relative overflow-hidden">
                      <img 
                        src={job.images?.[0] || getDomainImage(job.domain)}
                        alt={job.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {job.isHousingOffer && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-sholom-accent text-white">Logement</Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Informations de l'offre */}
                    <div className="lg:w-3/4 p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                          <div className="flex items-center text-sholom-muted mb-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="text-sm">{formatPublishDate(job.publishDate)}</span>
                            </div>
                            <span className="mx-2">•</span>
                            <Badge variant="outline" className="text-xs font-normal">
                              {translateDomain(job.domain)}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-sholom-dark mb-2 group-hover:text-sholom-primary transition-colors">
                            {job.title}
                          </h3>
                          
                          <div className="flex items-center mb-4">
                            <MapPin className="h-4 w-4 text-sholom-primary mr-1" />
                            <span className="text-sm text-sholom-muted">{job.location}</span>
                          </div>
                          
                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {job.description}
                          </p>
                        </div>
                        
                        <div className="md:text-right">
                          {job.isHousingOffer ? (
                            <div className="flex flex-col items-end">
                              <div className="text-2xl font-bold text-sholom-primary">
                                {formatPriceFCFA(job.price || 0)} FCFA
                              </div>
                              <div className="text-sm text-gray-500">par mois</div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end">
                              <div className="text-2xl font-bold text-sholom-primary">
                                {formatPriceFCFA(job.salary.amount)} FCFA
                              </div>
                              <div className="text-sm text-gray-500">
                                {job.salary.currency === 'EUR' ? 'par mois' : 'par mois'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                          {!job.isHousingOffer && (
                            <Badge variant="secondary" className="font-normal">
                              {translateContract(job.contract)}
                            </Badge>
                          )}
                          {job.isHousingOffer ? (
                            <>
                              {job.bedrooms && (
                                <Badge variant="secondary" className="font-normal">
                                  {job.bedrooms} chambre{job.bedrooms > 1 ? 's' : ''}
                                </Badge>
                              )}
                              {job.bathrooms && (
                                <Badge variant="secondary" className="font-normal">
                                  {job.bathrooms} salle{job.bathrooms > 1 ? 's' : ''} de bain
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge variant="secondary" className="font-normal">
                              {job.positions} poste{job.positions > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Date limite: {new Date(job.deadline).toLocaleDateString('fr-FR')}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-2 text-sholom-primary group-hover:bg-sholom-primary/10"
                          >
                            Voir les détails
                            <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune offre trouvée</h3>
            <p className="text-gray-500 mb-6">
              Aucune offre ne correspond à vos critères de recherche.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setDomainFilter('all');
                  setShowHousingOnly(false);
                }}
              >
                Réinitialiser les filtres
              </Button>
              <Link to="/">
                <Button className="bg-sholom-primary hover:bg-sholom-primary/90">
                  <Home className="mr-2 h-4 w-4" />
                  Voir les logements
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Pourquoi choisir Sholom - Section d'informations */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-sholom-dark mb-4">
              Pourquoi rejoindre Sholom ?
            </h2>
            <p className="text-sholom-muted text-lg max-w-2xl mx-auto">
              Nous offrons des avantages exceptionnels à tous nos employés
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Building className="h-8 w-8" />,
                title: "Logement Inclus",
                description: "Nous proposons des logements de qualité à nos employés à tarifs préférentiels"
              },
              {
                icon: <BriefcaseBusiness className="h-8 w-8" />,
                title: "Carrière Stable",
                description: "Des opportunités d'évolution et une sécurité d'emploi dans un secteur en croissance"
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Formation Continue",
                description: "Nous investissons dans votre développement professionnel avec des formations régulières"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm hover-shadow transition-all flex flex-col items-center text-center"
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
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {settings.siteName}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Jobs;
