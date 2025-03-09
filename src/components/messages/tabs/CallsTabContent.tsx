
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Call {
  id: number;
  user: string;
  avatar: string;
  type: 'incoming' | 'outgoing';
  timestamp: Date;
  missed: boolean;
}

interface CallsTabContentProps {
  calls: Call[];
}

const CallsTabContent: React.FC<CallsTabContentProps> = ({ calls }) => {
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [currentCallType, setCurrentCallType] = useState<'audio' | 'video'>('audio');
  const [callTo, setCallTo] = useState({ name: '', avatar: '' });
  
  const handleCall = (type: 'audio' | 'video', userName?: string, userAvatar?: string) => {
    setCurrentCallType(type);
    setCallTo({
      name: userName || 'Nouveau contact',
      avatar: userAvatar || '/placeholder.svg'
    });
    setCallDialogOpen(true);
  };

  const simulateCall = () => {
    // Fermer d'abord la boîte de dialogue
    setCallDialogOpen(false);
    
    // Simuler un appel en cours
    toast.info(`Appel ${currentCallType === 'audio' ? 'audio' : 'vidéo'} en cours avec ${callTo.name}...`, {
      duration: 3000,
    });
    
    // Puis simuler la fin de l'appel après quelques secondes
    setTimeout(() => {
      toast.success(`Appel terminé avec ${callTo.name}`, {
        description: `Durée: ${Math.floor(Math.random() * 5) + 1} minutes`,
      });
    }, 3000);
  };

  const formatCallTime = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Section pour passer un appel */}
      <div className="p-3 bg-white border-b">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-green-50 border-green-100 hover:bg-green-100 text-green-600"
            onClick={() => handleCall('audio')}
          >
            <Phone className="h-4 w-4 mr-1" />
            Appel audio
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-600"
            onClick={() => handleCall('video')}
          >
            <Video className="h-4 w-4 mr-1" />
            Appel vidéo
          </Button>
        </div>
      </div>
      
      {/* Historique des appels */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Historique des appels</h3>
          
          {calls.length > 0 ? (
            <div className="space-y-3">
              {calls.map((call) => (
                <div key={call.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                      <img 
                        src={call.avatar} 
                        alt={call.user} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{call.user}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        {call.type === 'incoming' ? (
                          <PhoneIncoming className={`h-3 w-3 mr-1 ${call.missed ? 'text-red-500' : 'text-green-500'}`} />
                        ) : (
                          <PhoneOutgoing className={`h-3 w-3 mr-1 ${call.missed ? 'text-red-500' : 'text-green-500'}`} />
                        )}
                        {call.missed ? 'Manqué · ' : ''}
                        {formatCallTime(call.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-green-600"
                    onClick={() => handleCall('audio', call.user, call.avatar)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Phone className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">
                Aucun appel récent.<br />Commencez un appel avec l'un de vos contacts.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Boîte de dialogue d'appel */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentCallType === 'audio' ? 'Appel audio' : 'Appel vidéo'} à {callTo.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
              <img 
                src={callTo.avatar}
                alt={callTo.name}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-lg font-medium">{callTo.name}</p>
            <p className="text-sm text-gray-500">
              {currentCallType === 'audio' ? 'Appel audio' : 'Appel vidéo'}
            </p>
          </div>
          
          <DialogFooter className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setCallDialogOpen(false)}
              className="rounded-full h-12 w-12 p-0 border-red-500 hover:bg-red-100"
            >
              <Phone className="h-5 w-5 text-red-500 transform rotate-135" />
            </Button>
            <Button 
              onClick={simulateCall}
              className="rounded-full h-12 w-12 p-0 bg-green-500 hover:bg-green-600"
            >
              {currentCallType === 'audio' ? (
                <Phone className="h-5 w-5" />
              ) : (
                <Video className="h-5 w-5" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallsTabContent;
