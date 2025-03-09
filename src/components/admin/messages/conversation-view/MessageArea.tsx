
import React from 'react';
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
  return (
    <div className="whatsapp-message-area">
      <div className="space-y-1 px-4">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id}
            message={message}
            senderAvatar={senderAvatar}
            senderName={senderName}
          />
        ))}
      </div>
    </div>
  );
};
