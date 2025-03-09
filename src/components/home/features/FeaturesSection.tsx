
import React from 'react';
import { SectionHeader } from './SectionHeader';
import { FeaturesGrid } from './FeaturesGrid';
import { ScrollAnimation } from '@/components/ui/scroll-animation';

export const FeaturesSection = () => {
  return (
    <ScrollAnimation 
      direction="right" 
      duration={0.8}
      className="py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Votre expérience de logement supérieure"
          subtitle="Des logements de qualité avec des services exceptionnels"
        />
        
        <FeaturesGrid />
      </div>
    </ScrollAnimation>
  );
};
