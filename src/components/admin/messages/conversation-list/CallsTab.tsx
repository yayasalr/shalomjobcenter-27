
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, Video, X, Microphone, Volume2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CallsTab: React.FC = () => {
  const [activeCallDialog, setActiveCallDialog] = useState(false);
  const [callDetails, setCallDetails] = useState<{
    type: 'audio' | 'video';
    user: { id: string; name: string; avatar: string; online: boolean };
  } | null>(null);
  
  // Simuler l'historique des appels
  const recentCalls = [
    { 
      id: 'call1', 
      user: { id: 'user1', name: 'Sarah Dupont', avatar: '/placeholder.svg', online: true }, 
      type: 'incoming', 
      callType: 'audio',
      status: 'missed',
      timestamp: new Date(Date.now() - 3600000)
    },
    { 
      id: 'call2', 
      user: { id: 'user2', name: 'Thomas Martin', avatar: '/placeholder.svg', online: false }, 
      type: 'outgoing', 
      callType: 'video',
      status: 'completed',
      timestamp: new Date(Date.now() - 86400000)
    },
    { 
      id: 'call3', 
      user: { id: 'user3', name: 'Lucie Bernard', avatar: '/placeholder.svg', online: true }, 
      type: 'incoming', 
      callType: 'audio',
      status: 'completed',
      timestamp: new Date(Date.now() - 172800000)
    }
  ];
  
  const handleStartCall = (type: 'audio' | 'video', user: { id: string; name: string; avatar: string; online: boolean }) => {
    setCallDetails({ type, user });
    setActiveCallDialog(true);
  };
  
  const handleEndCall = () => {
    toast.info(`Appel terminé avec ${callDetails?.user.name}`);
    setActiveCallDialog(false);
    setCallDetails(null);
  };
  
  // Formater la date
  const formatCallTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return `Aujourd'hui, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date >= yesterday) {
      return `Hier, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 p-0">
          <TabsTrigger value="all" className="text-xs">Tous</TabsTrigger>
          <TabsTrigger value="missed" className="text-xs">Manqués</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">Terminés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[calc(100vh-150px)]">
            <div className="p-1">
              {recentCalls.map(call => (
                <div 
                  key={call.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => handleStartCall(
                    call.callType as 'audio' | 'video', 
                    call.user
                  )}
                >
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3">
                      <img src={call.user.avatar} alt={call.user.name} />
                    </Avatar>
                    <div>
                      <p className={`font-medium ${call.status === 'missed' && call.type === 'incoming' ? 'text-red-500' : ''}`}>
                        {call.user.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        {call.type === 'incoming' ? 
                          <Phone className="h-3 w-3 mr-1 rotate-90" /> : 
                          <Phone className="h-3 w-3 mr-1 -rotate-90" />
                        }
                        <span>{call.type === 'incoming' ? 'Entrant' : 'Sortant'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">
                      {formatCallTime(call.timestamp)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${call.callType === 'audio' ? 'text-green-500' : 'text-blue-500'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartCall(call.callType as 'audio' | 'video', call.user);
                      }}
                    >
                      {call.callType === 'audio' ? <Phone className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="missed" className="mt-0">
          <ScrollArea className="h-[calc(100vh-150px)]">
            <div className="p-1">
              {recentCalls.filter(call => call.status === 'missed').map(call => (
                <div 
                  key={call.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => handleStartCall(
                    call.callType as 'audio' | 'video', 
                    call.user
                  )}
                >
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3">
                      <img src={call.user.avatar} alt={call.user.name} />
                    </Avatar>
                    <div>
                      <p className="font-medium text-red-500">{call.user.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Phone className="h-3 w-3 mr-1 rotate-90" />
                        <span>Appel manqué</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">
                      {formatCallTime(call.timestamp)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${call.callType === 'audio' ? 'text-green-500' : 'text-blue-500'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartCall(call.callType as 'audio' | 'video', call.user);
                      }}
                    >
                      {call.callType === 'audio' ? <Phone className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <ScrollArea className="h-[calc(100vh-150px)]">
            <div className="p-1">
              {recentCalls.filter(call => call.status === 'completed').map(call => (
                <div 
                  key={call.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => handleStartCall(
                    call.callType as 'audio' | 'video', 
                    call.user
                  )}
                >
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3">
                      <img src={call.user.avatar} alt={call.user.name} />
                    </Avatar>
                    <div>
                      <p className="font-medium">{call.user.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        {call.type === 'incoming' ? 
                          <Phone className="h-3 w-3 mr-1 rotate-90" /> : 
                          <Phone className="h-3 w-3 mr-1 -rotate-90" />
                        }
                        <span>{call.type === 'incoming' ? 'Entrant' : 'Sortant'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">
                      {formatCallTime(call.timestamp)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${call.callType === 'audio' ? 'text-green-500' : 'text-blue-500'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartCall(call.callType as 'audio' | 'video', call.user);
                      }}
                    >
                      {call.callType === 'audio' ? <Phone className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Active Call Dialog */}
      <Dialog open={activeCallDialog} onOpenChange={setActiveCallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {callDetails?.type === 'audio' ? 'Appel vocal' : 'Appel vidéo'} avec {callDetails?.user.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6">
            <Avatar className="h-24 w-24 mb-4">
              <img src={callDetails?.user.avatar || '/placeholder.svg'} alt={callDetails?.user.name || ''} />
            </Avatar>
            
            {callDetails?.type === 'video' && (
              <div className="bg-gray-200 rounded-lg w-full h-40 mb-4 flex items-center justify-center">
                <Video className="h-10 w-10 text-gray-400" />
              </div>
            )}
            
            <p className="text-lg font-semibold mb-2">{callDetails?.user.name}</p>
            <p className="text-sm text-gray-500 mb-6">
              {callDetails?.type === 'audio' ? 'Appel vocal en cours...' : 'Appel vidéo en cours...'}
            </p>
            
            <div className="flex gap-4">
              {callDetails?.type === 'audio' ? (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-full"
                  >
                    <Volume2 className="h-6 w-6 text-blue-500" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-full"
                  >
                    <Microphone className="h-6 w-6 text-blue-500" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-full"
                  >
                    <Video className="h-6 w-6 text-blue-500" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-full"
                  >
                    <Microphone className="h-6 w-6 text-blue-500" />
                  </Button>
                </>
              )}
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={handleEndCall}
              >
                <Phone className="h-6 w-6 rotate-135" />
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleEndCall}
            >
              Terminer l'appel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallsTab;
