
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseVoiceSearchProps {
  onResult: (result: string) => void;
  language?: string;
  onError?: (error: string) => void;
}

export const useVoiceSearch = ({ 
  onResult, 
  language = 'fr-FR',
  onError 
}: UseVoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    // Create recognition instance
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    // Configure recognition
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;

    // Set up event handlers
    recognitionInstance.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      
      setTranscript(currentTranscript);
      
      // If this is a final result, call the callback
      if (event.results[0].isFinal) {
        onResult(currentTranscript);
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      
      if (onError) {
        onError(event.error);
      } else {
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied');
        } else {
          toast.error(`Error: ${event.error}`);
        }
      }
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [language, onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.start();
      setIsListening(true);
      setTranscript('');
      toast.info('Écoute en cours...');
    } catch (error) {
      console.error('Error starting recognition:', error);
      toast.error('Impossible de démarrer la reconnaissance vocale');
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening
  };
};
