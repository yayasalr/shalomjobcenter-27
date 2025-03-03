
import React from 'react';
import { Button } from '@/components/ui/button';
import { StopCircle } from 'lucide-react';

interface VoiceRecorderProps {
  isRecording: boolean;
  recordingTime: number;
  stopRecording: () => void;
  formatRecordingTime: (seconds: number) => string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  recordingTime,
  stopRecording,
  formatRecordingTime
}) => {
  if (!isRecording) return null;
  
  return (
    <div className="recording-indicator flex items-center mr-2">
      <div className="recording-pulse mr-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span className="text-red-500 text-sm font-medium">{formatRecordingTime(recordingTime)}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-red-500 ml-2 touch-manipulation"
        onClick={stopRecording}
      >
        <StopCircle className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default VoiceRecorder;
