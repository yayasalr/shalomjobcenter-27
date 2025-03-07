
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionHeader } from './SectionHeader';
import { FeaturesGrid } from './FeaturesGrid';

export const FeaturesSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-24 mb-16">
      <SectionHeader 
        title={t('recommended_places')}
        subtitle={t('premium_housing')}
      />
      
      <FeaturesGrid />
    </div>
  );
};
