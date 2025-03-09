
import React from 'react';
import { useLanguage } from '@/hooks/language';

export const EmptyCompareSlot: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="border border-dashed border-gray-300 rounded-lg flex items-center justify-center h-40 bg-gray-50">
      <p className="text-gray-400 text-sm">{t('add_housing') || 'Ajoutez un logement'}</p>
    </div>
  );
};
