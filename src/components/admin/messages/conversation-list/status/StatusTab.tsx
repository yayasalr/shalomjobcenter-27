
import React, { useState } from 'react';
import { useStatusDialogs } from './hooks/useStatusDialogs';
import MyStatusSection from './components/MyStatusSection';
import RecentStatusList from './components/RecentStatusList';
import NewStatusDialog from './components/NewStatusDialog';
import StatusPreviewDialog from './components/StatusPreviewDialog';
import { Status } from './types';

export const StatusTab: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>(() => [
    {
      id: '1',
      type: 'text',
      user: { id: 'admin', name: 'Moi', avatar: '/placeholder.svg' },
      content: 'Bienvenue sur Shalom Job Center Message!',
      createdAt: new Date()
    },
    {
      id: '2',
      type: 'text',
      user: { id: 'user1', name: 'Sarah Dupont', avatar: '/placeholder.svg' },
      content: 'À la recherche de nouvelles opportunités!',
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: '3',
      type: 'image',
      user: { id: 'user3', name: 'Lucie Bernard', avatar: '/placeholder.svg' },
      content: '/placeholder.svg',
      createdAt: new Date(Date.now() - 7200000)
    }
  ]);

  // Dialog state management with custom hook
  const {
    newStatusOpen,
    statusType,
    statusPreviewOpen,
    selectedStatus,
    setNewStatusOpen,
    setStatusType,
    setStatusPreviewOpen,
    setSelectedStatus
  } = useStatusDialogs();

  // Status management functions
  const handleCreateStatus = (newStatus: Partial<Status>) => {
    // Create a new status and add it to the list
    const fullStatus: Status = {
      id: Date.now().toString(),
      type: statusType,
      user: { id: 'admin', name: 'Moi', avatar: '/placeholder.svg' },
      content: newStatus.content || '',
      createdAt: new Date()
    };
    
    setStatuses(prev => [fullStatus, ...prev]);
    setNewStatusOpen(false);
  };

  const handleViewStatus = (status: Status) => {
    setSelectedStatus(status);
    setStatusPreviewOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* My Status Section */}
      <MyStatusSection 
        myStatus={statuses[0]} 
        onTextClick={() => {
          setStatusType('text');
          setNewStatusOpen(true);
        }}
        onImageClick={() => {
          setStatusType('image');
          setNewStatusOpen(true);
        }}
        onStatusClick={handleViewStatus}
      />
      
      {/* Recent Statuses List */}
      <RecentStatusList 
        statuses={statuses.slice(1)} 
        onStatusClick={handleViewStatus} 
      />
      
      {/* Dialog for creating a new status */}
      <NewStatusDialog
        open={newStatusOpen}
        statusType={statusType}
        onOpenChange={setNewStatusOpen}
        onCreateStatus={handleCreateStatus}
      />
      
      {/* Dialog for previewing a status */}
      <StatusPreviewDialog
        open={statusPreviewOpen}
        status={selectedStatus}
        onOpenChange={setStatusPreviewOpen}
      />
    </div>
  );
};
