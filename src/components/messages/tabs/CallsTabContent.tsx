
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, X, Mic, MicOff, Camera as CameraIcon, Volume2, User } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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

const CallsTabContent: React.FC<CallsTabContentProps> = ({ calls: initialCalls }) => {
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [currentCallType, setCurrentCallType] = useState<'audio' | 'video'>('audio');
  const [callTo, setCallTo] = useState({ name: '', avatar: '' });
  const [activeCall, setActiveCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [calls, setCalls] = useState<Call[]>(initialCalls);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  
  const handleCall = (type: 'audio' | 'video', userName?: string, userAvatar?: string) => {
    setCurrentCallType(type);
    setCallTo({
      name: userName || 'New contact',
      avatar: userAvatar || '/placeholder.svg'
    });
    setCallDialogOpen(true);
    setCallDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
    setIsSpeakerOn(false);
  };

  const simulateCall = () => {
    // First close the dialog and show active call
    setCallDialogOpen(false);
    setActiveCall(true);
    
    // Start call timer
    let duration = 0;
    const timer = setInterval(() => {
      duration += 1;
      setCallDuration(duration);
    }, 1000);
    
    // Simulate call in progress
    toast.info(`${currentCallType === 'audio' ? 'Audio' : 'Video'} call in progress with ${callTo.name}...`, {
      duration: 3000,
    });
    
    // Don't auto end the call - let user end it
    return () => clearInterval(timer);
  };
  
  const endCall = () => {
    setActiveCall(false);
    
    // Add to call history
    const newCall: Call = {
      id: Date.now(),
      user: callTo.name,
      avatar: callTo.avatar,
      type: 'outgoing',
      timestamp: new Date(),
      missed: false
    };
    
    setCalls([newCall, ...calls]);
    
    // Notify user
    toast.success(`Call ended with ${callTo.name}`, {
      description: `Duration: ${formatDuration(callDuration)}`,
    });
  };

  const formatCallTime = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Microphone unmuted" : "Microphone muted", { duration: 1500 });
  };
  
  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    toast.info(isCameraOff ? "Camera turned on" : "Camera turned off", { duration: 1500 });
  };
  
  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast.info(isSpeakerOn ? "Speaker turned off" : "Speaker turned on", { duration: 1500 });
  };
  
  // Handle incoming call
  const simulateIncomingCall = () => {
    if (activeCall || callDialogOpen) return; // Don't simulate if already in a call
    
    const callers = [
      { name: "John Doe", avatar: "/placeholder.svg" },
      { name: "Lisa Smith", avatar: "/placeholder.svg" },
      { name: "Robert Johnson", avatar: "/placeholder.svg" }
    ];
    
    const randomCaller = callers[Math.floor(Math.random() * callers.length)];
    const callType = Math.random() > 0.5 ? 'audio' : 'video';
    
    setCallTo(randomCaller);
    setCurrentCallType(callType as 'audio' | 'video');
    
    // Show incoming call dialog
    toast(
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={randomCaller.avatar} />
          <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{randomCaller.name}</p>
          <p className="text-xs">Incoming {callType} call</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            size="sm"
            className="rounded-full h-8 w-8 p-0"
            onClick={() => {
              // Add missed call to history
              const newCall: Call = {
                id: Date.now(),
                user: randomCaller.name,
                avatar: randomCaller.avatar,
                type: 'incoming',
                timestamp: new Date(),
                missed: true
              };
              setCalls([newCall, ...calls]);
            }}
          >
            <Phone className="h-4 w-4 transform rotate-135" />
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="rounded-full h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
            onClick={() => {
              handleCall(callType as 'audio' | 'video', randomCaller.name, randomCaller.avatar);
            }}
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>,
      {
        duration: 20000, // 20 seconds to answer
        className: "min-w-[350px]"
      }
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Active call overlay */}
      {activeCall && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
          <div className="flex items-center justify-between p-6">
            <div className="text-white text-lg font-medium">
              {currentCallType === 'audio' ? 'Audio call' : 'Video call'}
            </div>
            <div className="text-white text-sm">
              {formatDuration(callDuration)}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {currentCallType === 'video' ? (
              <div className="relative h-full w-full max-w-2xl mx-auto p-4">
                {isCameraOff ? (
                  <div className="w-full h-4/5 bg-gray-700 rounded-xl flex items-center justify-center">
                    <User className="h-24 w-24 text-gray-400" />
                  </div>
                ) : (
                  <div className="w-full h-4/5 bg-gray-700 rounded-xl overflow-hidden">
                    <img 
                      src={callTo.avatar} 
                      alt={callTo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="absolute bottom-8 right-8 w-32 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                  <img 
                    src="/placeholder.svg" 
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-white">
                  <img 
                    src={callTo.avatar} 
                    alt={callTo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-white text-2xl font-medium mb-2">{callTo.name}</h2>
                <p className="text-gray-400">{isMuted ? 'Muted' : 'Connected'}</p>
              </div>
            )}
          </div>
          
          <div className="p-6 flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full h-14 w-14 ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'}`}
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            
            {currentCallType === 'video' && (
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full h-14 w-14 ${isCameraOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'}`}
                onClick={toggleCamera}
              >
                {isCameraOff ? (
                  <CameraIcon className="h-6 w-6" />
                ) : (
                  <CameraIcon className="h-6 w-6" />
                )}
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full h-14 w-14 ${isSpeakerOn ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
              onClick={toggleSpeaker}
            >
              <Volume2 className="h-6 w-6" />
            </Button>
            
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full h-14 w-14"
              onClick={endCall}
            >
              <Phone className="h-6 w-6 transform rotate-135" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Section for making a call */}
      <div className="p-3 bg-white border-b">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-green-50 border-green-100 hover:bg-green-100 text-green-600"
            onClick={() => handleCall('audio')}
          >
            <Phone className="h-4 w-4 mr-1" />
            Audio call
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-600"
            onClick={() => handleCall('video')}
          >
            <Video className="h-4 w-4 mr-1" />
            Video call
          </Button>
        </div>
        
        {/* Demo button to simulate incoming calls */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-gray-500 text-xs"
          onClick={simulateIncomingCall}
        >
          Simulate incoming call
        </Button>
      </div>
      
      {/* Call history */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Call history</h3>
          
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
                        {call.missed ? 'Missed · ' : ''}
                        {formatCallTime(call.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-green-600"
                      onClick={() => handleCall('audio', call.user, call.avatar)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-blue-600"
                      onClick={() => handleCall('video', call.user, call.avatar)}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Phone className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">
                No recent calls.<br />Start a call with one of your contacts.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Call dialog */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentCallType === 'audio' ? 'Audio call' : 'Video call'} to {callTo.name}
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
              {currentCallType === 'audio' ? 'Audio call' : 'Video call'}
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
