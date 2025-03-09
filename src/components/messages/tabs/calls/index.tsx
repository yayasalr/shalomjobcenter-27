
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Call, CallsTabContentProps } from './types';
import CallHeader from './CallHeader';
import CallsList from './CallsList';
import ActiveCall from './ActiveCall';

const CallsTabContent: React.FC<CallsTabContentProps> = ({ calls: initialCalls }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [callTimer, setCallTimer] = useState(0);
  const [callTimerInterval, setCallTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Initialize with default calls if none provided
  useEffect(() => {
    if (initialCalls && initialCalls.length > 0) {
      setCalls(initialCalls);
    } else {
      // Add default calls if none provided
      generateDefaultCalls();
    }
  }, [initialCalls]);
  
  // Generate default calls for demo
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

  // Start a new call
  const startCall = (isVideo: boolean = false) => {
    // Create a new outgoing call
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
    setCallTimer(0);
    
    // Start call timer
    const interval = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);
    
    setCallTimerInterval(interval);
    
    // Add new call to list after a few seconds (simulates connection)
    setTimeout(() => {
      setCalls(prev => [newCall, ...prev]);
    }, 2000);
    
    toast.success(`Appel ${isVideo ? 'vidéo' : 'audio'} en cours...`);
  };

  // End active call
  const endCall = () => {
    if (callTimerInterval) {
      clearInterval(callTimerInterval);
      setCallTimerInterval(null);
    }
    
    setActiveCall(null);
    toast.info("Appel terminé");
    
    // Update call in list
    if (activeCall) {
      const duration = callTimer;
      
      if (duration < 5) {
        // Mark call as missed if it lasted less than 5 seconds
        const missedCall = { ...activeCall, missed: true };
        setCalls(prev => prev.map(call => 
          call.id === activeCall.id ? missedCall : call
        ));
        
        toast.error("Appel manqué - trop court");
      }
    }
    
    // Reset call state
    setTimeout(() => {
      setCallTimer(0);
    }, 500);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (callTimerInterval) {
        clearInterval(callTimerInterval);
      }
    };
  }, [callTimerInterval]);
  
  // For admin, ensure there are always calls to display
  useEffect(() => {
    if (window.location.pathname.includes('/admin')) {
      if (calls.length === 0) {
        generateDefaultCalls();
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <CallHeader onStartCall={startCall} />
      <CallsList calls={calls} onCallUser={(call) => startCall(call.isVideo)} />
      <ActiveCall activeCall={activeCall} callTimer={callTimer} onEndCall={endCall} />
    </div>
  );
};

export default CallsTabContent;
