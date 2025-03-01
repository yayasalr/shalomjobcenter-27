
import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '@/types/job';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface JobsListProps {
  jobs: Job[];
}

export const JobsList = ({ jobs }: JobsListProps) => {
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
  
  return (
    <motion.div 
      className="space-y-6 px-4 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} itemVariants={itemVariants} />
      ))}
    </motion.div>
  );
};

interface JobCardProps {
  job: Job;
  itemVariants: any;
}

const JobCard = ({ job, itemVariants }: JobCardProps) => {
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
    <motion.div 
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
  );
};
