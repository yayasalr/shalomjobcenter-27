
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle } from 'lucide-react';

interface MessagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  message: string;
  recipient: string;
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({
  isOpen,
  onClose,
  onSend,
  message,
  recipient
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Aperçu du message</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Destinataire:</span>
            <span className="text-sm">{recipient}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Aperçu du message:</span>
            <ScrollArea className="h-[200px] border rounded-md p-3 bg-gray-50">
              <div className="whitespace-pre-wrap">{message}</div>
            </ScrollArea>
          </div>
        </div>
        
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onClose}>
              <XCircle className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={onSend}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
