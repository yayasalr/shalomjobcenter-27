
import React from 'react';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/hooks/language';

const EmptyState: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white p-8 rounded-lg shadow text-center">
      <div className="mb-4 text-gray-400">
        <FileText className="h-12 w-12 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{t('no_applications_found')}</h3>
      <p className="text-gray-500">{t('no_applications_matching')}</p>
    </div>
  );
};

export default EmptyState;
