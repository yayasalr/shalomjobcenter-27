
import React from 'react';
import { Job } from '@/types/job';
import JobDetailHeader from './JobDetailHeader';
import JobDescription from './JobDescription';
import JobRequirements from './JobRequirements';
import JobSidebar from './JobSidebar';
import { JobGallery } from './JobGallery';

interface JobDetailContentProps {
  job: Job;
  isLoading: boolean;
}

export const JobDetailContent: React.FC<JobDetailContentProps> = ({ job, isLoading }) => {
  if (isLoading) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <JobDetailHeader job={job} />
      
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-8">
          {/* Gallery */}
          <JobGallery job={job} className="w-full" />
          
          {/* Description */}
          <JobDescription job={job} />
          
          {/* Requirements */}
          <JobRequirements job={job} />
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <JobSidebar job={job} />
        </div>
      </div>
    </div>
  );
};
