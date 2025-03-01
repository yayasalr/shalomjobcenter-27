
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage 
}) => {
  const [isSending, setIsSending] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    try {
      handleSendMessage();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Textarea 
          placeholder="Écrivez votre message..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="min-h-[60px] resize-none"
          disabled={isSending}
        />
        <Button 
          onClick={sendMessage} 
          className="h-[60px]"
          disabled={isSending || !newMessage.trim()}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
