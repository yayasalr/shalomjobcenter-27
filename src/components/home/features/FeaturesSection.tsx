
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionHeader } from './SectionHeader';
import { FeaturesGrid } from './FeaturesGrid';
import { ScrollAnimation } from '@/components/ui/scroll-animation';

export const FeaturesSection = () => {
  const { t } = useLanguage();
  
  return (
    <ScrollAnimation 
      direction="right" 
      duration={0.8}
      className="py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Logements recommandés"
          subtitle="Des logements premium dans les meilleurs quartiers de Lomé pour une expérience de vie supérieure."
        />
        
        <FeaturesGrid />
      </div>
    </ScrollAnimation>
  );
};
