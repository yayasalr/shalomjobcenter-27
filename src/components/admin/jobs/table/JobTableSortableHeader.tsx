
import React from 'react';
import { Job } from '@/types/job';

interface JobTableSortableHeaderProps {
  column: keyof Job;
  sortBy: keyof Job;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof Job) => void;
  label: string;
  width?: string;
  className?: string;
}

export const JobTableSortableHeader: React.FC<JobTableSortableHeaderProps> = ({
  column,
  sortBy,
  sortDirection,
  onSort,
  label,
  width = 'auto',
  className = ''
}) => {
  return (
    <th className={`px-6 py-3 ${className}`} style={{ width }}>
      <button 
        onClick={() => onSort(column)} 
        className="flex items-center font-medium"
      >
        {label}
        {sortBy === column && (
          <span className="ml-1">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </button>
    </th>
  );
};
