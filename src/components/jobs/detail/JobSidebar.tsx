
import React, { useState } from 'react';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { formatPriceFCFA } from '../utils/jobUtils';
import { JobPriceCard } from './JobPriceCard';
import { JobInfoCards } from './JobInfoCards';
import { ApplicationForm } from './ApplicationForm';
import { Clock, MapPin, Building, Calendar } from 'lucide-react';

interface JobSidebarProps {
  job: Job;
}

const JobSidebar: React.FC<JobSidebarProps> = ({ job }) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  const toggleApplicationForm = () => {
    setShowApplicationForm(prev => !prev);
  };
  
  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
  };

  return (
    <div className="space-y-6">
      {job.isHousingOffer ? (
        <JobPriceCard price={job.price || 0} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-2">Rémunération</h3>
          <div className="text-3xl font-bold text-sholom-primary mb-1">
            {formatPriceFCFA(job.salary.amount)} FCFA
          </div>
          <div className="text-gray-500">par mois</div>
          
          <div className="mt-6">
            {!showApplicationForm ? (
              <Button 
                className="w-full bg-sholom-primary hover:bg-sholom-primary/90"
                onClick={toggleApplicationForm}
              >
                Postuler à cette offre
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={toggleApplicationForm}
              >
                Annuler
              </Button>
            )}
          </div>
        </div>
      )}
      
      {showApplicationForm && (
        <ApplicationForm job={job} onSuccess={handleApplicationSuccess} />
      )}
      
      <JobInfoCards job={job} />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Informations complémentaires</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-sholom-primary mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Date de publication</p>
              <p className="text-gray-600">{new Date(job.publishDate).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-sholom-primary mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Date limite</p>
              <p className="text-gray-600">{new Date(job.deadline).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-sholom-primary mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Localisation</p>
              <p className="text-gray-600">{job.location}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Building className="w-5 h-5 text-sholom-primary mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Entreprise</p>
              <p className="text-gray-600">Shalom Security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSidebar;
