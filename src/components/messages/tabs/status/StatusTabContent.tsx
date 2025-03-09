
import React from 'react';
import { StatusTabContentProps } from './types';
import StatusViewer from './StatusViewer';
import StatusCreator from './StatusCreator';
import StatusList from './StatusList';
import useStatusManagement from './hooks/useStatusManagement';

const StatusTabContent: React.FC<StatusTabContentProps> = ({ 
  statuses: initialStatuses = [], 
  onViewStatus,
  onStatusCreated
}) => {
  const {
    statuses,
    viewingStatus,
    setViewingStatus,
    handleViewStatus,
    handleStatusCreated
  } = useStatusManagement(initialStatuses);
  
  // Wrapper for handleViewStatus to call parent handler if provided
  const handleView = (status: any) => {
    handleViewStatus(status);
    
    // Call the parent handler
    if (onViewStatus) {
      onViewStatus(status);
    }
  };
  
  // Wrapper for handleStatusCreated to call parent handler if provided
  const handleCreate = (status: any) => {
    handleStatusCreated(status);
    
    // Call the parent handler
    if (onStatusCreated) {
      onStatusCreated(status);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Status viewer component */}
      <StatusViewer 
        status={viewingStatus}
        onClose={() => setViewingStatus(null)}
      />
      
      {/* Status creator component */}
      <StatusCreator onStatusCreated={handleCreate} />
      
      {/* Status list component */}
      <StatusList 
        statuses={statuses}
        onViewStatus={handleView}
      />
    </div>
  );
};

export default StatusTabContent;
