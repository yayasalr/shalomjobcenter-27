
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job';
import { getDomainImage } from '../utils/jobUtils';

interface JobDetailHeaderProps {
  job: Job;
}

const JobDetailHeader = ({ job }: JobDetailHeaderProps) => {
  const navigate = useNavigate();
  
  // Function to translate domain to French
  const translateDomain = (domain: string): string => {
    const domainTranslations: Record<string, string> = {
      residential_security: "Sécurité résidentielle",
      bodyguard: "Garde du corps",
      private_property: "Surveillance propriétés privées",
      industrial_security: "Sécurité industrielle",
      office_security: "Sécurité de bureau",
      security_patrol: "Patrouilleur",
      access_control: "Contrôle d'accès",
      security_systems: "Opérateur systèmes",
      construction_security: "Sécurité chantier",
      site_supervisor: "Surveillant travaux",
      security_coordinator: "Coordinateur sécurité",
      event_security: "Sécurité événementielle",
      k9_security: "Sécurité cynophile",
      security_manager: "Responsable sécurité",
      security_consultant: "Consultant sécurité",
      security_trainer: "Formateur sécurité",
      housing_offer: "Offre de logement"
    };
    
    return domainTranslations[domain] || domain;
  };
  
  return (
    <>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="hover:bg-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour aux offres
        </Button>
      </div>
      
      <div className="relative h-56 sm:h-72 md:h-96 bg-gray-200 overflow-hidden rounded-t-2xl">
        <img 
          src={job.image || getDomainImage(job.domain)} 
          alt={job.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-2">
            <Badge className="bg-sholom-primary text-white border-none">
              {job.isHousingOffer ? 'Logement' : translateDomain(job.domain)}
            </Badge>
            {job.status === 'active' ? (
              <Badge className="ml-2 bg-green-500 text-white border-none">
                Disponible
              </Badge>
            ) : (
              <Badge className="ml-2 bg-red-500 text-white border-none">
                Clôturée
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
          <div className="flex items-center text-white/80">
            <span>{job.location}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetailHeader;
