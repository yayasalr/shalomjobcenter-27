
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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 relative`}>
      <div 
        className={`whatsapp-message ${
          isUser ? 'whatsapp-user-message' : 'whatsapp-other-message'
        }`}
      >
        {isUser && <div className="whatsapp-tail-out"></div>}
        {!isUser && <div className="whatsapp-tail-in"></div>}
        
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        
        <div className="whatsapp-message-time">
          {formatTime(new Date(message.timestamp))}
          {message.sender === 'user' && (
            <span className="whatsapp-tick ml-1">
              {message.read ? (
                <span className="whatsapp-read-tick">✓✓</span>
              ) : (
                <span className="whatsapp-single-tick">✓</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
