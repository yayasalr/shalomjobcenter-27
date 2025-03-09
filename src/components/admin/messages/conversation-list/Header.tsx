
import React, { useState } from 'react';
import { MoreVertical, UserPlus, Camera, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simuler des contacts pour les différentes boîtes de dialogue
  const contacts = [
    { id: 'user1', name: 'Sarah Dupont', avatar: '/placeholder.svg', online: true },
    { id: 'user2', name: 'Thomas Martin', avatar: '/placeholder.svg', online: false },
    { id: 'user3', name: 'Lucie Bernard', avatar: '/placeholder.svg', online: true },
    { id: 'user4', name: 'Marc Robert', avatar: '/placeholder.svg', online: true },
    { id: 'user5', name: 'Emma Petit', avatar: '/placeholder.svg', online: false },
  ];

  const handleCamera = () => {
    setCameraOpen(true);
  };

  const handlePhone = () => {
    setCallType('audio');
    setCallDialogOpen(true);
  };

  const handleVideo = () => {
    setCallType('video');
    setCallDialogOpen(true);
  };

  const handleUserPlus = () => {
    setAddUserOpen(true);
  };

  const handleMore = () => {
    setMoreOptionsOpen(true);
  };

  const handleStartCall = (contactId: string, contactName: string) => {
    toast.success(`${callType === 'audio' ? 'Appel vocal' : 'Appel vidéo'} démarré avec ${contactName}`);
    setCallDialogOpen(false);
  };

  const handleAddToConversation = (contactId: string, contactName: string) => {
    toast.success(`${contactName} ajouté à la conversation`);
    setAddUserOpen(false);
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500"
            onClick={handleCamera}
          >
            <Camera className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500"
            onClick={handlePhone}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500"
            onClick={handleVideo}
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500"
            onClick={handleUserPlus}
          >
            <UserPlus className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500"
            onClick={handleMore}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Boîte de dialogue Caméra/Photo */}
      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Prendre une photo ou envoyer une image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
            <Camera className="h-16 w-16 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Cliquez pour prendre une photo ou déposez une image</p>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="camera-input"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  toast.success('Image prête à être envoyée');
                  setCameraOpen(false);
                }
              }}
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('camera-input')?.click()}
            >
              Sélectionner une image
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setCameraOpen(false)}
            >
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue d'appel (audio ou vidéo) */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {callType === 'audio' ? 'Démarrer un appel vocal' : 'Démarrer un appel vidéo'}
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <Input
              placeholder="Rechercher un contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            <ScrollArea className="h-60">
              <div className="space-y-2">
                {filteredContacts.map(contact => (
                  <div 
                    key={contact.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => handleStartCall(contact.id, contact.name)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <img src={contact.avatar} alt={contact.name} />
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-xs text-gray-500">
                          {contact.online ? 'En ligne' : 'Hors ligne'}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      {callType === 'audio' ? <Phone className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setCallDialogOpen(false)}
            >
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour ajouter un utilisateur */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter à la conversation</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <Input
              placeholder="Rechercher un contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            <ScrollArea className="h-60">
              <div className="space-y-2">
                {filteredContacts.map(contact => (
                  <div 
                    key={contact.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => handleAddToConversation(contact.id, contact.name)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <img src={contact.avatar} alt={contact.name} />
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-xs text-gray-500">
                          {contact.online ? 'En ligne' : 'Hors ligne'}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setAddUserOpen(false)}
            >
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour plus d'options */}
      <Dialog open={moreOptionsOpen} onOpenChange={setMoreOptionsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => {
                toast.info("Conversation archivée");
                setMoreOptionsOpen(false);
              }}
            >
              Archiver la conversation
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => {
                toast.info("Conversation désactivée");
                setMoreOptionsOpen(false);
              }}
            >
              Désactiver les notifications
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => {
                toast.info("Conversation marquée comme lue");
                setMoreOptionsOpen(false);
              }}
            >
              Marquer comme lu
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-500" 
              onClick={() => {
                toast.error("Conversation supprimée");
                setMoreOptionsOpen(false);
              }}
            >
              Supprimer la conversation
            </Button>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setMoreOptionsOpen(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
