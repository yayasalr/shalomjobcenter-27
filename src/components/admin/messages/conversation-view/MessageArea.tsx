
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
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
      {conversation.messages.map((message) => (
        <MessageBubble 
          key={message.id}
          message={message}
          isUser={message.sender === 'admin'}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageArea;
