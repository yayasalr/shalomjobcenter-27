
import React from 'react';

interface FooterSectionHeaderProps {
  title: string;
  description: string;
}

export const FooterSectionHeader: React.FC<FooterSectionHeaderProps> = ({
  title,
  description
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-blue-800">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </div>
  );
};
