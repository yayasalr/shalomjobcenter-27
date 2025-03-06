
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  filter: 'all' | 'unread' | 'important';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
  return (
    <div className="p-8 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
      <p className="text-gray-500">
        {filter === 'unread' 
          ? 'Aucun message non lu' 
          : filter === 'important'
            ? 'Aucune conversation importante'
            : 'Aucune conversation trouvée'}
      </p>
    </div>
  );
};
