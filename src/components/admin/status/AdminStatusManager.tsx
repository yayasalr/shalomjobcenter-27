
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';
import { StatusForm } from './components/StatusForm';
import { StatusList } from './components/StatusList';
import { useStatusManagement } from './hooks/useStatusManagement';
import { getTypeIcon } from './utils/statusUtils';

export const AdminStatusManager = () => {
  const {
    statusMessages,
    handlePublish,
    toggleStatusActive,
    deleteStatus
  } = useStatusManagement();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-sholom-primary" />
            Créer un nouveau statut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StatusForm handlePublish={handlePublish} />
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Statuts récents</h3>
        <StatusList 
          statusMessages={statusMessages}
          toggleStatusActive={toggleStatusActive}
          deleteStatus={deleteStatus}
          getTypeIcon={getTypeIcon}
        />
      </div>
    </div>
  );
};
