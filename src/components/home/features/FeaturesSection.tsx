
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionHeader } from './SectionHeader';
import { FeaturesGrid } from './FeaturesGrid';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

export const FeaturesSection = () => {
  const { t } = useLanguage();
  const [ref, isInView] = useInView({ once: true, threshold: 0.2 });
  
  const sectionVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };
  
  return (
    <motion.div 
      ref={ref}
      className="py-24 bg-gradient-to-b from-white to-gray-50"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
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
