
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { NewStatusDialogProps } from '../types';

const NewStatusDialog: React.FC<NewStatusDialogProps> = ({ 
  open, 
  statusType, 
  onOpenChange,
  onCreateStatus 
}) => {
  const [statusText, setStatusText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleCreateStatus = () => {
    if (statusType === 'text' && statusText.trim()) {
      onCreateStatus({ content: statusText.trim() });
      toast.success('Statut texte créé avec succès');
      setStatusText('');
    } else if (statusType === 'image' && selectedFile) {
      onCreateStatus({ content: URL.createObjectURL(selectedFile) });
      toast.success('Statut image créé avec succès');
      setSelectedFile(null);
    } else {
      toast.error('Veuillez remplir tous les champs requis');
    }
  };
  
  const handleClose = () => {
    onOpenChange(false);
    setStatusText('');
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {statusType === 'text' ? 'Créer un statut texte' : 'Créer un statut image'}
          </DialogTitle>
        </DialogHeader>
        
        {statusType === 'text' ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Qu'avez-vous en tête ?"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              className="min-h-24"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Aperçu" 
                  className="max-h-40 object-contain mb-4" 
                />
                <p className="text-sm mb-2">{selectedFile.name}</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedFile(null)}
                >
                  Changer d'image
                </Button>
              </div>
            ) : (
              <>
                <Camera className="h-16 w-16 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Cliquez pour prendre une photo ou déposez une image</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  id="status-image-input"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('status-image-input')?.click()}
                >
                  Sélectionner une image
                </Button>
              </>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleCreateStatus}>
            Publier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewStatusDialog;
