
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
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <JobDetailHeader job={job} />
          {job.images && job.images.length > 0 && (
            <JobGallery job={job} />
          )}
          <JobDescription description={job.description} />
          <JobRequirements 
            requirements={job.requirements}
            isHousingOffer={job.isHousingOffer || false}
            bedrooms={job.bedrooms}
            bathrooms={job.bathrooms}
          />
        </div>
        <div>
          <JobSidebar job={job} />
        </div>
      </div>
    </div>
  );
};
