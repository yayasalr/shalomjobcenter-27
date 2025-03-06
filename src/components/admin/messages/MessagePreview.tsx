
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aperçu du message</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-sm text-gray-500 mb-2">
            À: <span className="font-medium text-gray-700">{recipient}</span>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="whitespace-pre-wrap break-words text-gray-800">{message}</p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={onSend}>
            <Check className="h-4 w-4 mr-2" />
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
