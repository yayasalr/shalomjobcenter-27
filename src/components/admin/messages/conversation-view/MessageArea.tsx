
import React, { useEffect, useRef } from 'react';
import { Message } from '@/components/messages/types';
import { MessageBubble } from './MessageBubble';

interface MessageAreaProps {
  messages: Message[];
  senderAvatar: string;
  senderName: string;
}

export const MessageArea: React.FC<MessageAreaProps> = ({
  messages,
  senderAvatar,
  senderName
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="whatsapp-message-area flex-1 overflow-y-auto bg-[#e5ddd5]">
      <div className="space-y-2 px-4 py-4">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id}
            message={message}
            senderAvatar={senderAvatar}
            senderName={senderName}
          />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};
