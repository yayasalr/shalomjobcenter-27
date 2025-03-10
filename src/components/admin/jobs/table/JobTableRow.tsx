
import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, CalendarCheck, BriefcaseBusiness } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { JobActionsDropdown } from './JobActionsDropdown';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface JobTableRowProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

export const JobTableRow: React.FC<JobTableRowProps> = ({ job, onEdit, onDelete }) => {
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Fonction pour déterminer si une offre est expirée
  const isExpired = (job: Job) => {
    if (job.status === 'closed') return true;
    const deadlineDate = new Date(job.deadline);
    const today = new Date();
    return today > deadlineDate;
  };

  // Fonction pour obtenir le nom du domaine d'emploi
  const getDomainName = (domain: string) => {
    const domains: Record<string, string> = {
      'residential_security': 'Sécurité résidentielle',
      'bodyguard': 'Garde du corps',
      'private_property': 'Propriétés privées',
      'industrial_security': 'Sécurité industrielle',
      'event_security': 'Sécurité événementielle',
      'k9_security': 'Maître-chien',
      'security_trainer': 'Formateur sécurité',
      'housing_offer': 'Offre de logement'
    };
    
    return domains[domain] || domain;
  };

  // Fonction pour obtenir le nom du type de contrat
  const getContractName = (contract: string) => {
    const contracts: Record<string, string> = {
      'full_time': 'CDI',
      'part_time': 'Temps partiel',
      'contract': 'CDD'
    };
    
    return contracts[contract] || contract;
  };

  return (
    <tr 
      key={job.id} 
      className={`border-b hover:bg-gray-50 ${
        job.status === 'closed' || isExpired(job) ? 'bg-gray-50' : ''
      }`}
    >
      <td className="px-6 py-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              job.isHousingOffer ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              {job.isHousingOffer ? (
                <CalendarCheck className={`h-5 w-5 ${job.isHousingOffer ? 'text-purple-700' : 'text-blue-700'}`} />
              ) : (
                <BriefcaseBusiness className={`h-5 w-5 ${job.isHousingOffer ? 'text-purple-700' : 'text-blue-700'}`} />
              )}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{job.title}</div>
            <div className="text-gray-500 text-xs mt-1">
              {job.isHousingOffer ? (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Logement
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {getDomainName(job.domain)}
                </Badge>
              )}
              <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-700 border-gray-200">
                {getContractName(job.contract)}
              </Badge>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
          <span>{job.location}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        {job.isHousingOffer ? (
          <span>{job.price?.toLocaleString('fr-FR')} €</span>
        ) : (
          <span>{job.salary.amount.toLocaleString('fr-FR')} €</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`${isExpired(job) && job.status !== 'closed' ? 'text-amber-700' : ''}`}>
                {formatDate(job.deadline)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Publiée le {formatDate(job.publishDate)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          <StatusBadge job={job} />
          
          {job.applications && job.applications.length > 0 && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {job.applications.length} candidat{job.applications.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/emploi/${job.id}`} target="_blank">
                  <Button size="icon" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voir l'offre</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <JobActionsDropdown 
            job={job}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </td>
    </tr>
  );
};
