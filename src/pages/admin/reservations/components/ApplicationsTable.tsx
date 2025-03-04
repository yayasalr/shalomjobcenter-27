
import React from 'react';
import { JobApplication, Job } from '@/types/job';
import { 
  ApplicationsDesktopTable, 
  ApplicationsMobileList, 
  EmptyState, 
  LoadingState 
} from './applications-table';

interface ApplicationsTableProps {
  applications: {application: JobApplication, job: Job}[];
  updateApplicationStatus: (applicationId: string, jobId: string, status: 'pending' | 'approved' | 'rejected') => void;
  onSelectApplication: (application: JobApplication) => void;
  isLoading: boolean;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  updateApplicationStatus,
  onSelectApplication,
  isLoading
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (applications.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <ApplicationsMobileList 
        applications={applications} 
        updateApplicationStatus={updateApplicationStatus} 
        onSelectApplication={onSelectApplication} 
      />
      <ApplicationsDesktopTable 
        applications={applications} 
        updateApplicationStatus={updateApplicationStatus} 
        onSelectApplication={onSelectApplication} 
      />
    </>
  );
};

export default ApplicationsTable;
