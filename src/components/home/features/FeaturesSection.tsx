
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionHeader } from './SectionHeader';
import { FeaturesGrid } from './FeaturesGrid';
import { motion } from 'framer-motion';

export const FeaturesSection = () => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      className="py-24 bg-gradient-to-b from-white to-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader 
          title={t('recommended_places')}
          subtitle={t('premium_housing')}
        />
        
        <FeaturesGrid />
      </div>
    </motion.div>
  );
};
