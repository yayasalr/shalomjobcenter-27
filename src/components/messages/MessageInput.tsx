
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
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
    const sendingToast = toast.loading("Envoi du message...");
    
    // Add a small delay to simulate network latency
    setTimeout(() => {
      try {
        handleSendMessage();
        toast.dismiss(sendingToast);
      } catch (error) {
        toast.dismiss(sendingToast);
        toast.error("Erreur lors de l'envoi du message");
      } finally {
        setIsSending(false);
      }
    }, Math.random() * 1000 + 500); // 0.5-1.5 second delay
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
