
import { useState } from 'react';
import { Status } from '../types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

/**
 * Provides functionality for viewing and creating statuses
 */
export const useStatusActions = (statuses: Status[], setStatuses: React.Dispatch<React.SetStateAction<Status[]>>) => {
  const [viewingStatus, setViewingStatus] = useState<Status | null>(null);
  const { saveData, loadData } = useLocalStorage();
  
  // Handle viewing a status
  const handleViewStatus = (status: Status) => {
    // Mark status as viewed
    const updatedStatuses = statuses.map(s => 
      s.id === status.id ? {...s, isViewed: true} : s
    );
    setStatuses(updatedStatuses);
    saveData('user-statuses', updatedStatuses);
    setViewingStatus(status);
    
    // Auto-close the status after 5 seconds
    setTimeout(() => {
      setViewingStatus(null);
    }, 5000);
  };

  // Handle creating a new status
  const handleStatusCreated = (newStatus: Status) => {
    // Add the new status to the beginning of the existing array
    const updatedStatuses = [newStatus, ...statuses];
    setStatuses(updatedStatuses);
    saveData('user-statuses', updatedStatuses);
    
    // Also save to user-specific statuses
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.id) {
      const userStatusKey = `status_${currentUser.id}`;
      const userStatuses = loadData<Status[]>(userStatusKey, []);
      const updatedUserStatuses = [newStatus, ...(userStatuses || [])];
      saveData(userStatusKey, updatedUserStatuses);
    }
    
    toast.success("Statut publié avec succès! Il sera visible pendant 24 heures.");
  };
  
  return {
    viewingStatus,
    setViewingStatus,
    handleViewStatus,
    handleStatusCreated
  };
};
