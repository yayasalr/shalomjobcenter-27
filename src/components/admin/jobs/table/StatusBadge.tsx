
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types/job';

interface StatusBadgeProps {
  job: Job;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ job }) => {
  // Fonction pour déterminer si une offre est expirée
  const isExpired = (job: Job) => {
    if (job.status === 'closed') return true;
    const deadlineDate = new Date(job.deadline);
    const today = new Date();
    return today > deadlineDate;
  };

  // Fonction pour obtenir le style du badge de statut
  const getStatusBadgeStyle = (job: Job) => {
    if (job.status === 'closed') {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    
    return isExpired(job)
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-green-100 text-green-800 border-green-200';
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (job: Job) => {
    if (job.status === 'closed') return 'Clôturée';
    return isExpired(job) ? 'Expirée' : 'Active';
  };

  return (
    <Badge variant="outline" className={getStatusBadgeStyle(job)}>
      {getStatusText(job)}
    </Badge>
  );
};
