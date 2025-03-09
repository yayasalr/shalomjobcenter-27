
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, Camera, Image, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Status {
  id: number;
  user: string;
  avatar: string;
  isViewed: boolean;
  timestamp: Date;
}

interface StatusTabContentProps {
  statuses: Status[];
}

const StatusTabContent: React.FC<StatusTabContentProps> = ({ statuses }) => {
  const handleCreateStatus = (type: 'photo' | 'text') => {
    if (type === 'photo') {
      toast.info("Fonctionnalité de partage de photo à venir");
    } else {
      toast.info("Fonctionnalité de statut texte à venir");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Section pour créer un statut */}
      <div className="p-3 bg-white border-b">
        <div className="flex items-center mb-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <Plus className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Mon statut</p>
            <p className="text-xs text-gray-500">Appuyez pour ajouter un statut</p>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-3">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-green-50 border-green-100 hover:bg-green-100 text-green-600"
            onClick={() => handleCreateStatus('photo')}
          >
            <Camera className="h-4 w-4 mr-1" />
            Photo
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-600"
            onClick={() => handleCreateStatus('text')}
          >
            <Edit className="h-4 w-4 mr-1" />
            Texte
          </Button>
        </div>
      </div>
      
      {/* Liste des status */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Récents</h3>
          
          {statuses.length > 0 ? (
            <div className="space-y-3">
              {statuses.map((status) => (
                <div key={status.id} className="flex items-center">
                  <div className={`h-12 w-12 rounded-full border-2 ${status.isViewed ? 'border-gray-300' : 'border-green-500'} p-0.5`}>
                    <img 
                      src={status.avatar} 
                      alt={status.user} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{status.user}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(status.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Image className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">
                Aucun statut récent.<br />Les statuts disparaissent après 24 heures.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatusTabContent;
