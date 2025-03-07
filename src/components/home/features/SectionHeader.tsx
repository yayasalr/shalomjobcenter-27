
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export const SectionHeader = ({ title, subtitle, className = '' }: SectionHeaderProps) => {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="text-3xl font-serif font-bold text-sholom-dark mb-4">
        {title}
      </h2>
      <p className="text-sholom-muted text-lg max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};
