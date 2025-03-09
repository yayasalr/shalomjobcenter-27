
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-serif font-bold text-sholom-dark mb-3">
        {title}
      </h2>
      <p className="text-sholom-muted max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};
