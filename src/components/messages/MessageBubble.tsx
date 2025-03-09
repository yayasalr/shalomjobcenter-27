
import React from 'react';
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-1`}>
      <div 
        className={`message-bubble ${
          isUser ? 'message-bubble-user' : 'message-bubble-other'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div className="message-time">
          {formatTime(new Date(message.timestamp))}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
