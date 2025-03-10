
import React from 'react';
import { Job } from '@/types/job';
import { JobTableSortableHeader } from './JobTableSortableHeader';

interface JobTableHeaderProps {
  sortBy: keyof Job;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof Job) => void;
}

export const JobTableHeader: React.FC<JobTableHeaderProps> = ({ 
  sortBy, 
  sortDirection, 
  onSort 
}) => {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
      <tr>
        <JobTableSortableHeader 
          column="title"
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={onSort}
          label="Titre"
          width="40%"
        />
        <JobTableSortableHeader 
          column="location"
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={onSort}
          label="Localisation"
          width="auto"
        />
        <JobTableSortableHeader 
          column="salary"
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={onSort}
          label="Salaire (€)"
          width="auto"
          className="whitespace-nowrap"
        />
        <JobTableSortableHeader 
          column="deadline"
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={onSort}
          label="Date limite"
          width="auto"
          className="whitespace-nowrap"
        />
        <th className="px-6 py-3">Statut</th>
        <th className="px-6 py-3">Actions</th>
      </tr>
    </thead>
  );
};
