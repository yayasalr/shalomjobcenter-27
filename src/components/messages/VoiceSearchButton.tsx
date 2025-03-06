
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';

interface VoiceSearchButtonProps {
  onResult: (result: string) => void;
  language?: string;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({ 
  onResult,
  language = 'fr-FR'
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { isListening, startListening, stopListening } = useVoiceSearch({
    onResult: (result) => {
      setIsProcessing(true);
      onResult(result);
      // Give a slight delay to show processing
      setTimeout(() => setIsProcessing(false), 500);
    },
    language
  });

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Button
      variant={isListening ? "destructive" : "ghost"}
      size="icon"
      className={`rounded-full h-8 w-8 ${isListening ? 'animate-pulse' : ''}`}
      onClick={handleToggle}
      aria-label={isListening ? "Arrêter l'écoute" : "Recherche vocale"}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};
