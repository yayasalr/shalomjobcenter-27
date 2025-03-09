
import React, { useState, useEffect } from 'react';
import { Status } from './types';
import StatusViewer from './StatusViewer';
import StatusCreator from './StatusCreator';
import StatusList from './StatusList';
import { StatusTabContentProps } from './types';

const StatusTabContent: React.FC<StatusTabContentProps> = ({ statuses: initialStatuses }) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [viewingStatus, setViewingStatus] = useState<Status | null>(null);
  
  // Initialize with default statuses if none provided
  useEffect(() => {
    if (initialStatuses && initialStatuses.length > 0) {
      setStatuses(initialStatuses);
    } else {
      // Add default statuses if none provided
      generateDefaultStatuses();
    }
  }, [initialStatuses]);
  
  // Generate default statuses for demo
  const generateDefaultStatuses = () => {
    const defaultStatuses: Status[] = [
      {
        id: 1001,
        user: "Marie Dupont",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        content: "Bonjour à tous! Notre nouvelle politique de sécurité est maintenant disponible sur le portail."
      },
      {
        id: 1002,
        user: "Jean Martin",
        avatar: "/placeholder.svg",
        isViewed: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
      },
      {
        id: 1003,
        user: "Sophie Bernard",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        content: "Rappel: Réunion importante demain à 9h."
      },
      {
        id: 1004,
        user: "Thomas Lefebvre",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
      }
    ];
    
    setStatuses(defaultStatuses);
  };
  
  // Handler for adding a new status
  const handleStatusCreated = (newStatus: Status) => {
    setStatuses([newStatus, ...statuses]);
  };
  
  // View a status
  const handleViewStatus = (status: Status) => {
    // Mark status as viewed
    const updatedStatuses = statuses.map(s => 
      s.id === status.id ? {...s, isViewed: true} : s
    );
    setStatuses(updatedStatuses);
    setViewingStatus(status);
    
    // Auto-close the status after 5 seconds
    setTimeout(() => {
      setViewingStatus(null);
    }, 5000);
  };

  // When in admin view, auto-load additional example statuses
  useEffect(() => {
    if (window.location.pathname.includes('/admin')) {
      // Add some example statuses for admin view if statuses is empty
      if (statuses.length === 0) {
        generateDefaultStatuses();
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Status viewer component */}
      <StatusViewer 
        status={viewingStatus}
        onClose={() => setViewingStatus(null)}
      />
      
      {/* Status creator component */}
      <StatusCreator onStatusCreated={handleStatusCreated} />
      
      {/* Status list component */}
      <StatusList 
        statuses={statuses}
        onViewStatus={handleViewStatus}
      />
    </div>
  );
};

export default StatusTabContent;
