
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface SendButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-blue-500 hover:bg-blue-600"
      size="icon"
      aria-label="Envoyer le message"
    >
      <Send className="h-5 w-5" />
    </Button>
  );
};

export default SendButton;
