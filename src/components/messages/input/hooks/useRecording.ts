
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Clean up the recording timer and media stream if they exist
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaStreamRef.current = stream;
          
          // Create MediaRecorder instance
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          
          // Start recording
          mediaRecorder.start();
          setIsRecording(true);
          setRecordingTime(0);
          
          // Start a timer to track recording duration
          recordingTimerRef.current = window.setInterval(() => {
            setRecordingTime(prev => prev + 1);
          }, 1000);
          
          toast.success("Enregistrement vocal démarré");
          console.log('Microphone access granted, recording started');
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
          toast.error("Impossible d'accéder au microphone");
        });
    } else {
      toast.error("Votre navigateur ne supporte pas l'enregistrement audio");
    }
  };

  const stopRecording = () => {
    // Stop the timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    // Stop the media recorder if it exists
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop all tracks in the media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Update state
    const finalRecordingTime = recordingTime;
    setIsRecording(false);
    
    return finalRecordingTime;
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
