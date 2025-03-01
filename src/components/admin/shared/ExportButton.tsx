
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Job } from '@/types/job';
import { Listing } from '@/types/listing';

interface ExportButtonProps {
  data: Job[] | Listing[];
  type: 'jobs' | 'listings';
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data, type }) => {
  const exportToCSV = () => {
    let csvContent = '';

    if (type === 'jobs') {
      // En-têtes CSV pour les offres d'emploi
      csvContent = 'ID,Titre,Domain,Contrat,Localisation,Salaire,Positions,Date Publication,Date Limite,Statut\n';
      
      // Données
      (data as Job[]).forEach(job => {
        csvContent += `"${job.id}","${job.title}","${job.domain}","${job.contract}","${job.location}","${job.salary.amount}","${job.positions}","${job.publishDate}","${job.deadline}","${job.status}"\n`;
      });
    } else {
      // En-têtes CSV pour les logements
      csvContent = 'ID,Titre,Prix,Localisation,Rating,Dates\n';
      
      // Données
      (data as Listing[]).forEach(listing => {
        csvContent += `"${listing.id}","${listing.title}","${listing.price}","${listing.location}","${listing.rating}","${listing.dates}"\n`;
      });
    }

    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Export des ${type === 'jobs' ? 'offres d\'emploi' : 'logements'} réussi`);
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={exportToCSV}
      className="gap-2 bg-white border-gray-300"
    >
      <Download className="h-4 w-4" />
      Exporter
    </Button>
  );
};
