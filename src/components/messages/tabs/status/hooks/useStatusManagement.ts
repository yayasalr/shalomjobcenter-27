
import { useState, useEffect } from 'react';
import { Status } from '../types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import { filterExpiredStatuses, createNewStatus } from '../utils/statusUtils';

const useStatusManagement = (initialStatuses: Status[] = []) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [viewingStatus, setViewingStatus] = useState<Status | null>(null);
  const { loadData, saveData } = useLocalStorage();
  
  // Load statuses from local storage
  useEffect(() => {
    try {
      // Load user statuses
      const storedData = loadData<Status[]>('user-statuses', []);
      let processedStatuses: Status[] = [];
      
      if (Array.isArray(storedData)) {
        // Handle only valid Status objects
        processedStatuses = storedData.filter((item): item is Status => 
          item !== null && 
          typeof item === 'object' && 
          'id' in item &&
          'user' in item &&
          'avatar' in item &&
          'isViewed' in item &&
          'timestamp' in item
        );
      }
      
      // Load admin status messages if available
      const adminStatusMessages = loadData<any[]>('admin-status-messages', []);
      if (Array.isArray(adminStatusMessages) && adminStatusMessages.length > 0) {
        // Convert admin status messages to user status format
        const adminStatuses: Status[] = adminStatusMessages
          .filter((msg: any): msg is any => 
            msg !== null && 
            typeof msg === 'object' && 
            'id' in msg
          )
          .map((msg: any): Status => ({
            id: Number(msg.id),
            user: "Admin",
            avatar: "/placeholder.svg",
            isViewed: false,
            timestamp: new Date(msg.createdAt || Date.now()),
            content: msg.text,
            image: msg.imageUrl
          }));
        
        processedStatuses = [...processedStatuses, ...adminStatuses];
      }
      
      // Try to load statuses from individual users
      const usersList = loadData<any[]>('users', []);
      if (Array.isArray(usersList)) {
        for (const user of usersList) {
          if (user && typeof user === 'object' && 'id' in user) {
            const userStatusKey = `status_${user.id}`;
            const userStatuses = loadData<Status[]>(userStatusKey, []);
            if (Array.isArray(userStatuses) && userStatuses.length > 0) {
              // Only add valid status objects
              const validUserStatuses = userStatuses.filter((status): status is Status => 
                status !== null && 
                typeof status === 'object' && 
                'id' in status &&
                'user' in status &&
                'avatar' in status &&
                'isViewed' in status &&
                'timestamp' in status
              );
              processedStatuses = [...processedStatuses, ...validUserStatuses];
            }
          }
        }
      }
      
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
        generateDefaultStatuses();
      }
    } catch (error) {
      console.error('Error processing status data:', error);
      if (initialStatuses && initialStatuses.length > 0) {
        setStatuses(initialStatuses);
      } else {
        generateDefaultStatuses();
      }
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
  
  // When in admin view, load additional example statuses
  useEffect(() => {
    if (window.location.pathname.includes('/admin')) {
      // Add example statuses for admin view if statuses is empty
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
