
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Video, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Call {
  id: number;
  user: string;
  avatar: string;
  type: 'incoming' | 'outgoing';
  timestamp: Date;
  missed: boolean;
  isVideo?: boolean;
}

interface CallsTabContentProps {
  calls: Call[];
}

const CallsTabContent: React.FC<CallsTabContentProps> = ({ calls: initialCalls }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [callTimerInterval, setCallTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Initialiser avec des appels par défaut si aucun n'est fourni
  useEffect(() => {
    if (initialCalls && initialCalls.length > 0) {
      setCalls(initialCalls);
    } else {
      // Ajouter des appels par défaut si aucun n'est fourni
      generateDefaultCalls();
    }
  }, [initialCalls]);
  
  // Génération d'appels par défaut pour la démo
  const generateDefaultCalls = () => {
    const now = new Date();
    const defaultCalls: Call[] = [
      {
        id: 1,
        user: "Marie Dupont",
        avatar: "/placeholder.svg",
        type: "incoming",
        timestamp: new Date(now.getTime() - 1000 * 60 * 15), // 15 minutes ago
        missed: false,
        isVideo: false
      },
      {
        id: 2,
        user: "Jean Martin",
        avatar: "/placeholder.svg",
        type: "outgoing",
        timestamp: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour ago
        missed: false,
        isVideo: true
      },
      {
        id: 3,
        user: "Sophie Bernard",
        avatar: "/placeholder.svg",
        type: "incoming",
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 3), // 3 hours ago
        missed: true,
        isVideo: false
      },
      {
        id: 4,
        user: "Thomas Lefebvre",
        avatar: "/placeholder.svg",
        type: "outgoing",
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5), // 5 hours ago
        missed: true,
        isVideo: false
      }
    ];
    
    setCalls(defaultCalls);
  };

  // Formater la durée de l'appel
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Démarrer un nouvel appel
  const startCall = (isVideo: boolean = false) => {
    // Créer un nouvel appel sortant
    const newCall: Call = {
      id: Date.now(),
      user: "Nouveau contact",
      avatar: "/placeholder.svg",
      type: "outgoing",
      timestamp: new Date(),
      missed: false,
      isVideo
    };
    
    setActiveCall(newCall);
    setShowCallDialog(true);
    setCallTimer(0);
    
    // Démarrer le compteur de temps d'appel
    const interval = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);
    
    setCallTimerInterval(interval);
    
    // Ajouter le nouvel appel à la liste après quelques secondes (simule la connexion)
    setTimeout(() => {
      setCalls(prev => [newCall, ...prev]);
    }, 2000);
    
    toast.success(`Appel ${isVideo ? 'vidéo' : 'audio'} en cours...`);
  };

  // Terminer l'appel actif
  const endCall = () => {
    if (callTimerInterval) {
      clearInterval(callTimerInterval);
      setCallTimerInterval(null);
    }
    
    setShowCallDialog(false);
    toast.info("Appel terminé");
    
    // Mettre à jour l'appel dans la liste
    if (activeCall) {
      const duration = callTimer;
      
      if (duration < 5) {
        // Si l'appel a duré moins de 5 secondes, le marquer comme manqué
        const missedCall = { ...activeCall, missed: true };
        setCalls(prev => prev.map(call => 
          call.id === activeCall.id ? missedCall : call
        ));
        
        toast.error("Appel manqué - trop court");
      }
    }
    
    // Réinitialiser l'état de l'appel
    setTimeout(() => {
      setActiveCall(null);
      setCallTimer(0);
    }, 500);
  };

  // Nettoyer le timer lors du démontage du composant
  useEffect(() => {
    return () => {
      if (callTimerInterval) {
        clearInterval(callTimerInterval);
      }
    };
  }, [callTimerInterval]);
  
  // Pour l'admin, s'assurer qu'il y a toujours des appels à afficher
  useEffect(() => {
    if (window.location.pathname.includes('/admin')) {
      if (calls.length === 0) {
        generateDefaultCalls();
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header avec boutons d'appel */}
      <div className="p-3 bg-white border-b">
        <div className="flex justify-between">
          <h2 className="text-sm font-medium">Appels récents</h2>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => startCall(false)}
            >
              <Phone className="h-4 w-4 mr-1" />
              Audio
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => startCall(true)}
            >
              <Video className="h-4 w-4 mr-1" />
              Vidéo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Liste des appels */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {calls.length > 0 ? (
            <div className="space-y-3">
              {calls.map((call) => (
                <div 
                  key={call.id} 
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                >
                  <Avatar className="h-10 w-10">
                    <img 
                      src={call.avatar} 
                      alt={call.user} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  </Avatar>
                  
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{call.user}</p>
                    <div className="flex items-center text-xs">
                      {call.type === 'incoming' ? (
                        call.missed ? (
                          <PhoneMissed className="h-3 w-3 text-red-500 mr-1" />
                        ) : (
                          <PhoneIncoming className="h-3 w-3 text-green-500 mr-1" />
                        )
                      ) : (
                        <PhoneOutgoing className="h-3 w-3 text-blue-500 mr-1" />
                      )}
                      
                      <span className={`${call.missed ? 'text-red-500' : 'text-gray-500'}`}>
                        {call.type === 'incoming' ? 'Entrant' : 'Sortant'} 
                        {call.isVideo && ' · Vidéo'}
                        {call.missed && ' · Manqué'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {call.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-green-500 hover:text-green-600 hover:bg-green-50"
                    onClick={() => {
                      toast.info(`Appeler ${call.user}?`);
                      startCall(call.isVideo || false);
                    }}
                  >
                    {call.isVideo ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <PhoneCall className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">
                Aucun appel récent.<br />
                Cliquez sur 'Audio' ou 'Vidéo' pour passer un appel.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Dialogue d'appel en cours */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {activeCall?.isVideo ? 'Appel vidéo' : 'Appel audio'} en cours
            </DialogTitle>
            <DialogDescription className="text-center">
              avec {activeCall?.user}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6">
            <Avatar className="h-20 w-20 mb-4">
              <img 
                src={activeCall?.avatar || "/placeholder.svg"} 
                alt={activeCall?.user || "Contact"} 
                className="h-full w-full rounded-full object-cover"
              />
            </Avatar>
            
            {activeCall?.isVideo && (
              <div className="bg-gray-200 rounded-lg w-full max-w-xs h-40 mb-4 flex items-center justify-center">
                <p className="text-gray-500">Flux vidéo simulé</p>
              </div>
            )}
            
            <p className="text-xl font-medium mb-2">{activeCall?.user}</p>
            <p className="text-gray-500 mb-4">{formatCallDuration(callTimer)}</p>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12"
                onClick={() => {
                  toast.info("Microphone " + (Math.random() > 0.5 ? "activé" : "désactivé"));
                }}
              >
                <Info className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="destructive" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-red-500 hover:bg-red-600"
                onClick={endCall}
              >
                <Phone className="h-5 w-5 rotate-[135deg]" />
              </Button>
              
              {activeCall?.isVideo && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                  onClick={() => {
                    toast.info("Caméra " + (Math.random() > 0.5 ? "activée" : "désactivée"));
                  }}
                >
                  <Video className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <Button 
              variant="secondary" 
              onClick={endCall}
            >
              Terminer l'appel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallsTabContent;
