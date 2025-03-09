
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { StatusPreviewDialogProps } from '../types';

const StatusPreviewDialog: React.FC<StatusPreviewDialogProps> = ({ 
  open, 
  status, 
  onOpenChange 
}) => {
  if (!status) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <img 
                src={status.user.avatar} 
                alt={status.user.name} 
              />
            </Avatar>
            <DialogTitle>{status.user.name}</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4">
          {status.type === 'text' ? (
            <div className="bg-gray-100 p-4 rounded-lg w-full">
              <p className="text-lg">{status.content}</p>
            </div>
          ) : (
            <img 
              src={status.content} 
              alt="Statut" 
              className="max-h-60 object-contain" 
            />
          )}
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusPreviewDialog;
