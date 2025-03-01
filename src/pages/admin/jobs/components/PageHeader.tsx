
import React from 'react';
import { ExportButton } from '@/components/admin/shared/ExportButton';
import { AddItemButton } from '@/components/admin/shared/AddItemButton';
import { Job } from '@/types/job';
import { Listing } from '@/types/listing';

interface PageHeaderProps {
  activeTab: string;
  itemCount: number;
  onCreateItem: () => void;
  exportData: Job[] | Listing[];
  exportType: 'jobs' | 'listings';
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  activeTab, 
  itemCount, 
  onCreateItem, 
  exportData, 
  exportType 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des offres</h1>
        <p className="text-gray-500 mt-1">
          {activeTab === 'jobs' 
            ? `${itemCount} offre(s) d'emploi disponible(s)` 
            : `${itemCount} logement(s) disponible(s)`}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <ExportButton data={exportData} type={exportType} />
        
        <AddItemButton
          onClick={onCreateItem}
          label={activeTab === 'jobs' ? "Ajouter une offre" : "Ajouter un logement"}
        />
      </div>
    </div>
  );
};
