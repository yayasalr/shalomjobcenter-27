
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

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
              handleSendMessage();
            }
          }}
          className="min-h-[60px] resize-none"
        />
        <Button onClick={handleSendMessage} className="h-[60px]">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
