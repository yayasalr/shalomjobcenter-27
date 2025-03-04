
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { StatusMessage } from '../types';
import { formatDate } from '../utils/statusUtils';

interface StatusListProps {
  statusMessages: StatusMessage[];
  toggleStatusActive: (id: string) => void;
  deleteStatus: (id: string) => void;
  getTypeIcon: (type: 'announcement' | 'promotion' | 'info' | 'alert') => React.ReactNode;
}

export const StatusList: React.FC<StatusListProps> = ({
  statusMessages,
  toggleStatusActive,
  deleteStatus,
  getTypeIcon
}) => {
  if (statusMessages.length === 0) {
    return <p className="text-gray-500 text-center py-4">Aucun statut publié</p>;
  }

  return (
    <div className="space-y-3">
      {statusMessages.map((status) => (
        <Card key={status.id}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-4">
              <div 
                className={`p-2 rounded-md flex-shrink-0 ${
                  status.active ? 'opacity-100' : 'opacity-50'
                }`}
                style={{ backgroundColor: status.backgroundColor, color: status.textColor }}
              >
                {getTypeIcon(status.type)}
              </div>
              
              <div className={`flex-1 ${status.active ? '' : 'opacity-50'}`}>
                <p className="font-medium">{status.text}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(status.createdAt)}
                </p>
              </div>
              
              {status.imageUrl && (
                <div className={`h-12 w-12 rounded-md overflow-hidden flex-shrink-0 ${
                  status.active ? '' : 'opacity-50'
                }`}>
                  <img src={status.imageUrl} alt="Status" className="h-full w-full object-cover" />
                </div>
              )}
              
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`switch-${status.id}`}
                    checked={status.active}
                    onCheckedChange={() => toggleStatusActive(status.id)}
                  />
                  <Label htmlFor={`switch-${status.id}`} className="text-xs">
                    {status.active ? 'Actif' : 'Inactif'}
                  </Label>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 h-8 w-8 p-0"
                  onClick={() => deleteStatus(status.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
