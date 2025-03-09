
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { faker } from '@faker-js/faker';
import { Call, CallsTabContentProps } from './types';
import CallHeader from './CallHeader';
import CallsList from './CallsList';
import ActiveCall from './ActiveCall';

const CallsTabContent: React.FC<CallsTabContentProps> = ({ calls: initialCalls = [] }) => {
  const [calls, setCalls] = useState<Call[]>(initialCalls.length > 0 ? initialCalls : generateDemoCalls());
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [callTimer, setCallTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Handle starting a new call
  const handleStartCall = (isVideo: boolean) => {
    // Get a random user from the calls list or create a new one
    const randomUser = calls.length > 0 
      ? calls[Math.floor(Math.random() * calls.length)]
      : {
          id: Date.now(),
          user: faker.person.fullName(),
          avatar: '/placeholder.svg',
          type: 'outgoing' as const,
          timestamp: new Date(),
          missed: false,
          isVideo: isVideo
        };
    
    // Create a new outgoing call
    const newCall: Call = {
      ...randomUser,
      id: Date.now(),
      type: 'outgoing',
      timestamp: new Date(),
      missed: false,
      isVideo: isVideo
    };
    
    // Add the call to the calls list
    setCalls(prevCalls => [newCall, ...prevCalls]);
    
    // Set the active call
    setActiveCall(newCall);
    
    // Start the timer
    startTimer();
    
    // Show a toast notification
    toast.success(`Appel ${isVideo ? 'vidéo' : 'audio'} en cours avec ${newCall.user}`);
  };

  // Handle calling a user from the call list
  const handleCallUser = (call: Call) => {
    // Create a new outgoing call based on the selected user
    const newCall: Call = {
      ...call,
      id: Date.now(),
      type: 'outgoing',
      timestamp: new Date(),
      missed: false
    };
    
    // Add the call to the calls list
    setCalls(prevCalls => [newCall, ...prevCalls]);
    
    // Set the active call
    setActiveCall(newCall);
    
    // Start the timer
    startTimer();
    
    // Show a toast notification
    toast.success(`Appel ${newCall.isVideo ? 'vidéo' : 'audio'} en cours avec ${newCall.user}`);
  };

  // Handle ending a call
  const handleEndCall = () => {
    // Stop the timer
    stopTimer();
    
    // Clear the active call
    setActiveCall(null);
    
    // Reset the timer
    setCallTimer(0);
    
    // Show a toast notification
    toast.info('Appel terminé');
  };

  // Start the call timer
  const startTimer = () => {
    // Clear any existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Start a new interval to increment the timer every second
    const interval = setInterval(() => {
      setCallTimer(prevTimer => prevTimer + 1);
    }, 1000);
    
    // Save the interval ID
    setTimerInterval(interval);
  };

  // Stop the call timer
  const stopTimer = () => {
    // Clear the interval
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Clean up the timer interval when the component unmounts
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return (
    <div className="flex flex-col h-full">
      {activeCall ? (
        <ActiveCall 
          activeCall={activeCall} 
          callTimer={callTimer} 
          onEndCall={handleEndCall} 
        />
      ) : (
        <>
          <CallHeader onStartCall={handleStartCall} />
          <CallsList calls={calls} onCallUser={handleCallUser} />
        </>
      )}
    </div>
  );
};

// Generate some demo calls for the initial state
const generateDemoCalls = (): Call[] => {
  const now = new Date();
  
  return Array(5).fill(null).map((_, index) => {
    const isIncoming = Math.random() > 0.5;
    const isMissed = Math.random() > 0.7;
    const isVideo = Math.random() > 0.7;
    
    return {
      id: index + 1,
      user: faker.person.fullName(),
      avatar: '/placeholder.svg',
      type: isIncoming ? 'incoming' : 'outgoing',
      timestamp: new Date(now.getTime() - Math.random() * 86400000 * 7), // Random time within the last week
      missed: isMissed,
      isVideo: isVideo
    };
  });
};

export default CallsTabContent;
