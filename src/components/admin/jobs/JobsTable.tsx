
import React from 'react';
import { Job } from '@/types/job';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash, Briefcase, MapPin, Clock, Users } from 'lucide-react';

interface JobsTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

export const JobsTable: React.FC<JobsTableProps> = ({ jobs, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const getContractLabel = (contract: string) => {
    switch (contract) {
      case 'full_time':
        return 'Temps plein';
      case 'part_time':
        return 'Temps partiel';
      case 'contract':
        return 'Contrat';
      default:
        return contract;
    }
  };

  const getDomainLabel = (domain: string) => {
    const domains: Record<string, string> = {
      residential_security: 'Sécurité résidentielle',
      bodyguard: 'Garde du corps',
      private_property: 'Surveillance propriétés privées',
      industrial_security: 'Sécurité industrielle',
      office_security: 'Sécurité de bureau',
      security_patrol: 'Patrouilleur',
      access_control: 'Contrôle d\'accès',
      security_systems: 'Opérateur systèmes',
      construction_security: 'Sécurité chantier',
      site_supervisor: 'Surveillant travaux',
      security_coordinator: 'Coordinateur sécurité',
      event_security: 'Sécurité événementielle',
      k9_security: 'Sécurité cynophile',
      security_manager: 'Responsable sécurité',
      security_consultant: 'Consultant sécurité',
      security_trainer: 'Formateur sécurité'
    };
    
    return domains[domain] || domain;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase tracking-wider bg-gray-50">
            <tr>
              <th className="px-6 py-3">Titre</th>
              <th className="px-6 py-3">Domaine</th>
              <th className="px-6 py-3">Localisation</th>
              <th className="px-6 py-3">Contrat</th>
              <th className="px-6 py-3">Salaire</th>
              <th className="px-6 py-3">Date limite</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{job.title}</td>
                <td className="px-6 py-4 text-gray-600">{getDomainLabel(job.domain)}</td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {job.location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                    {getContractLabel(job.contract)}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">
                  {job.salary.amount} {job.salary.currency}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {formatDate(job.deadline)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={job.status === 'active' ? 'success' : 'destructive'}>
                    {job.status === 'active' ? 'Active' : 'Fermée'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(job)}
                      className="flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(job.id)}
                      className="flex items-center"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {jobs.length === 0 && (
        <div className="text-center py-10">
          <Users className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune offre d'emploi</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer une nouvelle offre d'emploi.
          </p>
        </div>
      )}
    </div>
  );
};
