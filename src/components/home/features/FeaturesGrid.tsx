
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, Home, Medal, MapPin, Clock, CheckCircle } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { motion } from 'framer-motion';

export const FeaturesGrid = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('secure_payment'),
      description: t('secure_payment_desc')
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: t('premium_housing'),
      description: t('premium_housing_desc')
    },
    {
      icon: <Medal className="h-6 w-6" />,
      title: t('quality_verified'),
      description: t('quality_verified_desc')
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('prime_locations'),
      description: t('prime_locations_desc')
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: t('24_7_support'),
      description: t('24_7_support_desc')
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: t('satisfaction_guarantee'),
      description: t('satisfaction_guarantee_desc')
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          index={index}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </motion.div>
  );
};
