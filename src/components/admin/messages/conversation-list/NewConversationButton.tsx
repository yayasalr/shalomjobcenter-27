
import React, { useState } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface NewConversationButtonProps {
  handleCreateNewConversation?: () => void;
}

export const NewConversationButton: React.FC<NewConversationButtonProps> = ({
  handleCreateNewConversation
}) => {
  const [newConversationDialog, setNewConversationDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simuler des contacts
  const contacts = [
    { id: 'user1', name: 'Sarah Dupont', avatar: '/placeholder.svg', online: true },
    { id: 'user2', name: 'Thomas Martin', avatar: '/placeholder.svg', online: false },
    { id: 'user3', name: 'Lucie Bernard', avatar: '/placeholder.svg', online: true },
    { id: 'user4', name: 'Marc Robert', avatar: '/placeholder.svg', online: true },
    { id: 'user5', name: 'Emma Petit', avatar: '/placeholder.svg', online: false },
  ];

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="p-3 bg-gray-50 border-t">
        <Button 
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          onClick={() => {
            if (handleCreateNewConversation) {
              handleCreateNewConversation();
            } else {
              setNewConversationDialog(true);
            }
          }}
        >
          <MessageSquare className="h-4 w-4 mr-2" /> Nouvelle conversation
        </Button>
      </div>

      {/* Boîte de dialogue pour sélectionner un contact */}
      <Dialog open={newConversationDialog} onOpenChange={setNewConversationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle conversation</DialogTitle>
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
                    onClick={() => {
                      setNewConversationDialog(false);
                      // Si un gestionnaire est fourni, utilisez-le
                      if (handleCreateNewConversation) {
                        handleCreateNewConversation();
                      }
                    }}
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
                      <MessageSquare className="h-4 w-4" />
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
              onClick={() => setNewConversationDialog(false)}
            >
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewConversationButton;
