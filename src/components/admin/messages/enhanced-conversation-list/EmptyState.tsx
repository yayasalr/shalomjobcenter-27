
import React from 'react';
import { AlertCircle, Search, MessageSquareX, Star } from 'lucide-react';

interface EmptyStateProps {
  filter: 'all' | 'unread' | 'important';
  hasSearchQuery?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filter, hasSearchQuery = false }) => {
  // Choisir l'icône appropriée en fonction du contexte
  const Icon = hasSearchQuery ? Search : 
    filter === 'unread' ? MessageSquareX : 
    filter === 'important' ? Star : AlertCircle;
  
  // Message personnalisé en fonction du contexte
  let message = '';
  
  if (hasSearchQuery) {
    message = 'Aucun résultat ne correspond à votre recherche';
  } else {
    switch(filter) {
      case 'unread':
        message = 'Aucun message non lu';
        break;
      case 'important':
        message = 'Aucune conversation importante';
        break;
      default:
        message = 'Aucune conversation trouvée';
    }
  }
  
  return (
    <div className="p-8 text-center">
      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-600 font-medium mb-1">
        {message}
      </p>
      <p className="text-gray-500 text-sm">
        {hasSearchQuery 
          ? 'Essayez avec d\'autres termes ou critères de recherche' 
          : filter === 'all' 
            ? 'Vous n\'avez aucune conversation pour le moment'
            : 'Revenez plus tard ou vérifiez un autre filtre'}
      </p>
    </div>
  );
};
