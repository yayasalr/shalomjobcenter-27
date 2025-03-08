
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  index?: number;
}

export const FeatureCard = ({ icon, title, description, className, index = 0 }: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center",
        "hover:border-gray-200 hover:-translate-y-1",
        className
      )}
    >
      <div className="bg-sholom-primary/10 text-sholom-primary p-3 rounded-full mb-4 hover:bg-sholom-primary/15 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-sholom-dark mb-2">
        {title}
      </h3>
      <p className="text-sholom-muted">
        {description}
      </p>
    </div>
  );
};
