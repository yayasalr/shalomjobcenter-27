
import React from 'react';
import { useLanguage } from '@/hooks/language';

const LoadingState: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-10">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">{t('loading')}</span>
      </div>
      <p className="mt-2 text-gray-500">{t('loading_applications')}</p>
    </div>
  );
};

export default LoadingState;
