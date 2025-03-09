import { useState, useEffect } from 'react';
import { Status } from '../types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { filterExpiredStatuses } from '../utils/statusUtils';
import { useStatusData } from './useStatusData';
import { useDefaultStatuses } from './useDefaultStatuses';
import { useStatusActions } from './useStatusActions';
import { useAdminStatusCheck } from './useAdminStatusCheck';

const useStatusManagement = (initialStatuses: Status[] = []) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const { saveData } = useLocalStorage();
  
  // Load statuses from local storage
  useEffect(() => {
    try {
      // Use the extracted hook to load all status data
      const processedStatuses = useStatusData();
      
      if (processedStatuses.length > 0) {
        // Filter out expired statuses (older than 24 hours)
        const validStatuses = filterExpiredStatuses(processedStatuses);
        
        setStatuses(validStatuses);
        
        // Save back the filtered list if any were removed
        if (validStatuses.length !== processedStatuses.length) {
          saveData('user-statuses', validStatuses);
        }
      } else if (initialStatuses && initialStatuses.length > 0) {
        setStatuses(initialStatuses);
      } else {
        // Add default statuses if none provided
        const defaultStatuses = useDefaultStatuses();
        setStatuses(defaultStatuses);
      }
    } catch (error) {
      console.error('Error processing status data:', error);
      if (initialStatuses && initialStatuses.length > 0) {
        setStatuses(initialStatuses);
      } else {
        const defaultStatuses = useDefaultStatuses();
        setStatuses(defaultStatuses);
      }
    }
  }, [initialStatuses]); // Dependency array
  
  // Get status action handlers
  const {
    viewingStatus,
    setViewingStatus,
    handleViewStatus,
    handleStatusCreated
  } = useStatusActions(statuses, setStatuses);
  
  // Check if we're on the admin page and handle default statuses
  useAdminStatusCheck(() => {
    // Add example statuses for admin view if statuses is empty
    if (statuses.length === 0) {
      const defaultStatuses = useDefaultStatuses();
      setStatuses(defaultStatuses);
    }
  }, [statuses.length]);
  
  return {
    statuses,
    viewingStatus,
    setViewingStatus,
    handleViewStatus,
    handleStatusCreated
  };
};

export default useStatusManagement;
