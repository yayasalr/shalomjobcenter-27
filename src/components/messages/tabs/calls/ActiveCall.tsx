
import React from 'react';
import { Phone, Info, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { ActiveCallProps } from './types';

const ActiveCall: React.FC<ActiveCallProps> = ({ activeCall, callTimer, onEndCall }) => {
  // Formater la durée de l'appel
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeCall) return null;

  return (
    <Dialog open={!!activeCall} onOpenChange={() => onEndCall()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {activeCall.isVideo ? 'Appel vidéo' : 'Appel audio'} en cours
          </DialogTitle>
          <DialogDescription className="text-center">
            avec {activeCall.user}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6">
          <Avatar className="h-20 w-20 mb-4">
            <img 
              src={activeCall.avatar || "/placeholder.svg"} 
              alt={activeCall.user || "Contact"} 
              className="h-full w-full rounded-full object-cover"
            />
          </Avatar>
          
          {activeCall.isVideo && (
            <div className="bg-gray-200 rounded-lg w-full max-w-xs h-40 mb-4 flex items-center justify-center">
              <p className="text-gray-500">Flux vidéo simulé</p>
            </div>
          )}
          
          <p className="text-xl font-medium mb-2">{activeCall.user}</p>
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
              onClick={onEndCall}
            >
              <Phone className="h-5 w-5 rotate-[135deg]" />
            </Button>
            
            {activeCall.isVideo && (
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
            onClick={onEndCall}
          >
            Terminer l'appel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveCall;
