
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
  let subMessage = '';
  
  if (hasSearchQuery) {
    message = 'Aucun résultat ne correspond à votre recherche';
    subMessage = 'Essayez avec d\'autres termes ou critères de recherche';
  } else {
    switch(filter) {
      case 'all':
        message = 'Aucune conversation importante';
        subMessage = 'Revenez plus tard ou vérifiez un autre filtre';
        break;
      case 'unread':
        message = 'Aucun message non lu';
        subMessage = 'Revenez plus tard ou vérifiez un autre filtre';
        break;
      case 'important':
        message = 'Aucune conversation importante';
        subMessage = 'Marquez des conversations comme importantes pour les retrouver ici';
        break;
      default:
        message = 'Aucune conversation trouvée';
        subMessage = 'Vous n\'avez aucune conversation pour le moment';
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <Icon className="mx-auto h-16 w-16 text-gray-400 mb-3" />
      <p className="text-xl font-medium text-gray-700 mb-1">
        {message}
      </p>
      <p className="text-gray-500 text-sm">
        {subMessage}
      </p>
    </div>
  );
};
