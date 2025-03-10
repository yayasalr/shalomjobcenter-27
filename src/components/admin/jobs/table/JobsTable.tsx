
import React, { useState } from 'react';
import { Job } from '@/types/job';
import { JobTableHeader } from './JobTableHeader';
import { JobTableRow } from './JobTableRow';

interface JobsTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

export const JobsTable: React.FC<JobsTableProps> = ({ jobs, onEdit, onDelete }) => {
  const [sortBy, setSortBy] = useState<keyof Job>('publishDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Fonction pour changer le tri
  const handleSort = (column: keyof Job) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Tri des offres
  const sortedJobs = [...jobs].sort((a, b) => {
    // Gestion du tri selon différents types de champs
    if (sortBy === 'salary') {
      return sortDirection === 'asc'
        ? a.salary.amount - b.salary.amount
        : b.salary.amount - a.salary.amount;
    } else if (sortBy === 'publishDate' || sortBy === 'deadline') {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      // Pour les champs de type string
      const valA = String(a[sortBy] || '').toLowerCase();
      const valB = String(b[sortBy] || '').toLowerCase();
      return sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <JobTableHeader 
          sortBy={sortBy} 
          sortDirection={sortDirection} 
          onSort={handleSort} 
        />
        <tbody>
          {sortedJobs.map((job) => (
            <JobTableRow 
              key={job.id} 
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
