
import React, { useEffect, useRef } from 'react';
import { Conversation } from '@/components/messages/types';
import MessageBubble from '@/components/messages/MessageBubble';

interface MessageAreaProps {
  conversation: Conversation;
}

const MessageArea: React.FC<MessageAreaProps> = ({ conversation }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 scrollbar-container" style={{ backgroundColor: 'var(--whatsapp-chat-background)' }}>
      <div className="container mx-auto max-w-4xl">
        {conversation.messages.map((message) => (
          <MessageBubble 
            key={message.id}
            message={message}
            isUser={message.sender === 'admin'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageArea;
