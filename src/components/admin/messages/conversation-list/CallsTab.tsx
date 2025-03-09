
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Call {
  id: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  time: Date;
  duration?: number; // en secondes, undefined pour les appels manqués
}

const CallsTab: React.FC = () => {
  const [newCallOpen, setNewCallOpen] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCallOpen, setActiveCallOpen] = useState(false);
  const [activeCallUser, setActiveCallUser] = useState<{id: string, name: string, avatar: string} | null>(null);
  const [activeCallType, setActiveCallType] = useState<'audio' | 'video'>('audio');
  const [callDuration, setCallDuration] = useState(0);
  
  // Simulation des appels récents
  const calls: Call[] = [
    {
      id: '1',
      type: 'audio',
      direction: 'outgoing',
      user: { id: 'user1', name: 'Sarah Dupont', avatar: '/placeholder.svg' },
      time: new Date(Date.now() - 3600000),
      duration: 125
    },
    {
      id: '2',
      type: 'video',
      direction: 'incoming',
      user: { id: 'user3', name: 'Lucie Bernard', avatar: '/placeholder.svg' },
      time: new Date(Date.now() - 7200000),
      duration: 304
    },
    {
      id: '3',
      type: 'audio',
      direction: 'missed',
      user: { id: 'user2', name: 'Thomas Martin', avatar: '/placeholder.svg' },
      time: new Date(Date.now() - 86400000)
    },
    {
      id: '4',
      type: 'audio',
      direction: 'outgoing',
      user: { id: 'user4', name: 'Marc Robert', avatar: '/placeholder.svg' },
      time: new Date(Date.now() - 172800000),
      duration: 62
    }
  ];

  // Contacts pour la boîte de dialogue
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

  const formatCallTime = (time: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (time > today) {
      return `Aujourd'hui ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (time > yesterday) {
      return `Hier ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return time.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  const formatCallDuration = (seconds?: number): string => {
    if (!seconds) return 'Appel manqué';
    
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleCallButton = (type: 'audio' | 'video') => {
    setCallType(type);
    setNewCallOpen(true);
  };

  const startCall = (contact: typeof contacts[0]) => {
    setActiveCallUser(contact);
    setActiveCallType(callType);
    setCallDuration(0);
    setNewCallOpen(false);
    setActiveCallOpen(true);
    
    // Simulation de la durée d'appel qui s'incrémente
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // Nettoyer l'intervalle quand la boîte de dialogue est fermée
    return () => clearInterval(interval);
  };

  const formatActiveDuration = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    toast.info(`Appel terminé après ${formatActiveDuration(callDuration)}`);
    setActiveCallOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Boutons pour passer un nouvel appel */}
      <div className="p-3 border-b">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => handleCallButton('audio')}
          >
            <Phone className="h-4 w-4 mr-2" /> Appel vocal
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => handleCallButton('video')}
          >
            <Video className="h-4 w-4 mr-2" /> Appel vidéo
          </Button>
        </div>
      </div>
      
      {/* Liste des appels */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          <h3 className="font-medium mb-2">Appels récents</h3>
          <div className="space-y-2">
            {calls.map(call => (
              <div 
                key={call.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (call.direction !== 'missed') {
                    setCallType(call.type);
                    startCall(call.user);
                  } else {
                    toast.info(`Rappeler ${call.user.name}`);
                    setCallType('audio');
                    startCall(call.user);
                  }
                }}
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <img src={call.user.avatar} alt={call.user.name} />
                  </Avatar>
                  <div>
                    <p className="font-medium">{call.user.name}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      {call.direction === 'incoming' ? (
                        <PhoneIncoming className="h-3 w-3 mr-1 text-green-500" />
                      ) : call.direction === 'outgoing' ? (
                        <PhoneOutgoing className="h-3 w-3 mr-1 text-blue-500" />
                      ) : (
                        <PhoneMissed className="h-3 w-3 mr-1 text-red-500" />
                      )}
                      {formatCallTime(call.time)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">
                    {formatCallDuration(call.duration)}
                  </span>
                  {call.type === 'audio' ? (
                    <Phone className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Video className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      {/* Boîte de dialogue pour passer un nouvel appel */}
      <Dialog open={newCallOpen} onOpenChange={setNewCallOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {callType === 'audio' ? 'Appel vocal' : 'Appel vidéo'}
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
                    onClick={() => startCall(contact)}
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
                      {callType === 'audio' ? (
                        <Phone className="h-4 w-4" />
                      ) : (
                        <Video className="h-4 w-4" />
                      )}
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
              onClick={() => setNewCallOpen(false)}
            >
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Boîte de dialogue d'appel actif */}
      <Dialog open={activeCallOpen} onOpenChange={setActiveCallOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <Avatar className="h-24 w-24 mb-4">
              <img 
                src={activeCallUser?.avatar || '/placeholder.svg'} 
                alt={activeCallUser?.name || 'Contact'} 
              />
            </Avatar>
            <h3 className="text-xl font-bold mb-2">{activeCallUser?.name}</h3>
            <p className="text-gray-500 mb-6">
              {activeCallType === 'audio' ? 'Appel vocal' : 'Appel vidéo'} en cours...
            </p>
            <p className="text-2xl font-mono mb-8">{formatActiveDuration(callDuration)}</p>
            
            {activeCallType === 'video' && (
              <div className="bg-gray-200 w-full h-40 rounded-lg mb-8 flex items-center justify-center">
                <p className="text-gray-500">Flux vidéo simulé</p>
              </div>
            )}
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12"
                onClick={() => toast.info('Microphone mis en sourdine')}
              >
                <Phone className="h-6 w-6" />
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="rounded-full h-12 w-12"
                onClick={handleEndCall}
              >
                <PhoneMissed className="h-6 w-6" />
              </Button>
              {activeCallType === 'video' && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                  onClick={() => toast.info('Caméra désactivée')}
                >
                  <Video className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallsTab;
