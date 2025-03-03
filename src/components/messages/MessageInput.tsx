
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Mic, Smile } from 'lucide-react';
import { toast } from 'sonner';

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
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    
    // Add a small delay to simulate network latency
    setTimeout(() => {
      try {
        handleSendMessage();
      } finally {
        setIsSending(false);
      }
    }, 200); // Very short delay for near-instant feel
  };

  return (
    <div className="whatsapp-input-area">
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-500 hover:bg-gray-200 rounded-full"
      >
        <Smile className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-500 hover:bg-gray-200 rounded-full"
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      
      <div 
        contentEditable 
        className="whatsapp-input" 
        onInput={(e) => setNewMessage(e.currentTarget.textContent || '')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        suppressContentEditableWarning={true}
      >
        {newMessage}
      </div>
      
      <Button 
        onClick={sendMessage} 
        disabled={!newMessage.trim() || isSending}
        className="whatsapp-send-button"
        size="icon"
      >
        {newMessage.trim() ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default MessageInput;
