
import React from 'react';
import { JobApplication, Job } from '@/types/job';
import ApplicationMobileCard from './ApplicationMobileCard';

interface ApplicationsMobileListProps {
  applications: {application: JobApplication, job: Job}[];
  updateApplicationStatus: (applicationId: string, jobId: string, status: 'pending' | 'approved' | 'rejected') => void;
  onSelectApplication: (application: JobApplication) => void;
}

const ApplicationsMobileList: React.FC<ApplicationsMobileListProps> = ({
  applications,
  updateApplicationStatus,
  onSelectApplication
}) => {
  return (
    <div className="space-y-4 lg:hidden">
      {applications.map((item) => (
        <ApplicationMobileCard
          key={item.application.id}
          application={item.application}
          job={item.job}
          onSelectApplication={onSelectApplication}
          updateApplicationStatus={updateApplicationStatus}
        />
      ))}
    </div>
  );
};

export default ApplicationsMobileList;
