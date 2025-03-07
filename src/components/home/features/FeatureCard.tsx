
import React from 'react';
import { cn } from '@/lib/utils';
import { Briefcase, Home, Shield, Medal, MapPin, Clock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FeatureCard = ({ icon, title, description, className, style }: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center",
        className
      )}
      style={style}
    >
      <div className="bg-sholom-primary/10 text-sholom-primary p-3 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-sholom-dark mb-2">
        {title}
      </h3>
      <p className="text-sholom-muted">
        {description}
      </p>
    </div>
  );
};
