
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = "Écrivez un message..."
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="message-input-area">
      <div
        className="message-input"
        contentEditable
        onInput={(e) => onChange(e.currentTarget.textContent || '')}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{__html: value}}
      />
      
      <Button 
        onClick={onSend}
        disabled={!value.trim()}
        className="rounded-full bg-blue-500 hover:bg-blue-600"
        size="icon"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MessageInput;
