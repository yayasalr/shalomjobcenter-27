
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clean up the recording timer if it exists
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start a timer to track recording duration
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // This would normally start actual audio recording
      toast.success("Enregistrement vocal démarré");
      
      // Simulate requesting microphone access
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Here you would normally start recording
          console.log('Microphone access granted, recording started');
        })
        .catch(err => {
          toast.error("Impossible d'accéder au microphone");
          stopRecording();
        });
    } else {
      toast.error("Votre navigateur ne supporte pas l'enregistrement audio");
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    setIsRecording(false);
    
    return recordingTime;
  };

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    formatRecordingTime
  };
};
