
import { useState, useEffect } from 'react';
import { Status } from '../types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

export const useStatusManagement = (initialStatuses: Status[] = []) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [viewingStatus, setViewingStatus] = useState<Status | null>(null);
  const { loadData, saveData } = useLocalStorage();
  
  // Load statuses from local storage
  useEffect(() => {
    const storedStatuses = loadData<Status[]>('user-statuses', []);
    
    if (storedStatuses && storedStatuses.length > 0) {
      // Filter out expired statuses (older than 24 hours)
      const now = new Date();
      const validStatuses = storedStatuses.filter(status => {
        const statusDate = new Date(status.timestamp);
        const hoursDiff = (now.getTime() - statusDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff < 24; // Keep statuses less than 24 hours old
      });
      
      setStatuses(validStatuses);
      
      // Save back the filtered list if any were removed
      if (validStatuses.length !== storedStatuses.length) {
        saveData('user-statuses', validStatuses);
      }
    } else if (initialStatuses && initialStatuses.length > 0) {
      setStatuses(initialStatuses);
    } else {
      // Add default statuses if none provided
      generateDefaultStatuses();
    }
  }, [initialStatuses]); // Dependency array
  
  // Generate default statuses for demo
  const generateDefaultStatuses = () => {
    const now = new Date();
    
    const defaultStatuses: Status[] = [
      {
        id: 1001,
        user: "Marie Dupont",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
        content: "Bonjour à tous! Notre nouvelle politique de sécurité est maintenant disponible sur le portail.",
        image: "/placeholder.svg" // Add default image
      },
      {
        id: 1002,
        user: "Thomas Martin",
        avatar: "/placeholder.svg",
        isViewed: true,
        timestamp: new Date(now.getTime() - 1000 * 60 * 120), // 2 hours ago
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
      },
      {
        id: 1003,
        user: "Sophie Bernard",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 240), // 3 hours ago
        content: "Vacances en Italie! 🌞🍕",
        image: "/placeholder.svg"
      },
      {
        id: 1004,
        user: "Thomas Lefebvre",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 240), // 4 hours ago
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
      }
    ];
    
    setStatuses(defaultStatuses);
    saveData('user-statuses', defaultStatuses);
  };
  
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
    
    toast.success("Statut publié avec succès! Il sera visible pendant 24 heures.");
  };
  
  // When in admin view, auto-load additional example statuses
  useEffect(() => {
    if (window.location.pathname.includes('/admin')) {
      // Add some example statuses for admin view if statuses is empty
      if (statuses.length === 0) {
        generateDefaultStatuses();
      }
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
