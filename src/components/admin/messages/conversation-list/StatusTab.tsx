
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Edit, Plus } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface Status {
  id: string;
  type: 'image' | 'text';
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: Date;
}

const StatusTab: React.FC = () => {
  const [newStatusOpen, setNewStatusOpen] = useState(false);
  const [statusType, setStatusType] = useState<'image' | 'text'>('text');
  const [statusText, setStatusText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusPreviewOpen, setStatusPreviewOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  // Statuts simulés
  const statuses: Status[] = [
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
  ];

  const handleCreateStatus = () => {
    if (statusType === 'text' && statusText.trim()) {
      toast.success('Statut texte créé avec succès');
      setNewStatusOpen(false);
      setStatusText('');
    } else if (statusType === 'image' && selectedFile) {
      toast.success('Statut image créé avec succès');
      setNewStatusOpen(false);
      setSelectedFile(null);
    } else {
      toast.error('Veuillez remplir tous les champs requis');
    }
  };

  const handleViewStatus = (status: Status) => {
    setSelectedStatus(status);
    setStatusPreviewOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête Mon statut */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Mon statut</h3>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500" 
              onClick={() => {
                setStatusType('text');
                setNewStatusOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500" 
              onClick={() => {
                setStatusType('image');
                setNewStatusOpen(true);
              }}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Mon statut récent */}
        <div 
          className="flex items-center mt-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          onClick={() => handleViewStatus(statuses[0])}
        >
          <Avatar className="h-12 w-12 mr-3">
            <img src="/placeholder.svg" alt="Moi" />
          </Avatar>
          <div>
            <p className="font-medium">Mon statut</p>
            <p className="text-xs text-gray-500">
              Il y a {Math.floor(Math.random() * 59) + 1} min
            </p>
          </div>
        </div>
      </div>
      
      {/* Statuts récents */}
      <div className="p-3 border-b">
        <h3 className="font-medium mb-2">Statuts récents</h3>
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="space-y-2">
            {statuses.slice(1).map(status => (
              <div 
                key={status.id}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => handleViewStatus(status)}
              >
                <Avatar className="h-12 w-12 mr-3">
                  <img src={status.user.avatar} alt={status.user.name} />
                </Avatar>
                <div>
                  <p className="font-medium">{status.user.name}</p>
                  <p className="text-xs text-gray-500">
                    Il y a {Math.floor(Math.random() * 59) + 1} min
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Boîte de dialogue pour créer un nouveau statut */}
      <Dialog open={newStatusOpen} onOpenChange={setNewStatusOpen}>
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
            <Button variant="secondary" onClick={() => setNewStatusOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateStatus}>
              Publier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Boîte de dialogue pour prévisualiser un statut */}
      <Dialog open={statusPreviewOpen} onOpenChange={setStatusPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <img 
                  src={selectedStatus?.user.avatar || '/placeholder.svg'} 
                  alt={selectedStatus?.user.name || 'Utilisateur'} 
                />
              </Avatar>
              <DialogTitle>{selectedStatus?.user.name || 'Statut'}</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            {selectedStatus?.type === 'text' ? (
              <div className="bg-gray-100 p-4 rounded-lg w-full">
                <p className="text-lg">{selectedStatus.content}</p>
              </div>
            ) : (
              <img 
                src={selectedStatus?.content || '/placeholder.svg'} 
                alt="Statut" 
                className="max-h-60 object-contain" 
              />
            )}
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setStatusPreviewOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatusTab;
