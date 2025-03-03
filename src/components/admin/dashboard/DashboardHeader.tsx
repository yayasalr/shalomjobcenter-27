
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
};
