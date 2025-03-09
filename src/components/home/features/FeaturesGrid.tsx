
import React from 'react';
import { Shield, Home, Medal, MapPin, Clock, CheckCircle } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { ScrollAnimation } from '@/components/ui/scroll-animation';

export const FeaturesGrid = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Paiement sécurisé",
      description: "Transactions protégées par cryptage avancé"
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: "Logements premium",
      description: "Sélectionnés pour leur qualité et confort"
    },
    {
      icon: <Medal className="h-6 w-6" />,
      title: "Qualité vérifiée",
      description: "Tous nos logements sont inspectés"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Emplacements privilégiés",
      description: "Dans les meilleurs quartiers de Lomé"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Support 24/7",
      description: "Notre équipe est toujours disponible"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Satisfaction garantie",
      description: "Votre satisfaction est notre priorité"
    }
  ];

  return (
    <ScrollAnimation 
      direction="up"
      staggerContainer={true}
      staggerChildren={0.1}
      delay={0.2}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
    >
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          index={index}
        />
      ))}
    </ScrollAnimation>
  );
};
