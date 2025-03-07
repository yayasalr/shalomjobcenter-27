
import React from 'react';
import { Home, Shield, CheckCircle } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { useLanguage } from '@/hooks/useLanguage';

interface FeaturesGridProps {
  className?: string;
}

export const FeaturesGrid = ({ className }: FeaturesGridProps) => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Home className="h-8 w-8" />,
      title: t('verified_housing'),
      description: t('verified_housing')
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('secure_payments'),
      description: t('secure_payments')
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: t('local_support'),
      description: t('local_support')
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};
