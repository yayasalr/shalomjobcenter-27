
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import { Conversation } from './types';

interface MessageListProps {
  conversation: Conversation;
}

const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scrolling automatique vers le dernier message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const renderMessageStatus = (message: any) => {
    if (message.sender !== 'user') return null;
    
    if (message.read) {
      return (
        <span className="whatsapp-tick whatsapp-read-tick">
          <Check className="h-3 w-3 inline" />
          <Check className="h-3 w-3 inline -ml-1" />
        </span>
      );
    } else {
      return (
        <span className="whatsapp-tick whatsapp-single-tick">
          <Check className="h-3 w-3 inline" />
        </span>
      );
    }
  };

  return (
    <div className="whatsapp-message-area">
      <div className="space-y-1">
        {conversation.messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender !== 'user' && (
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarImage src={conversation.with.avatar} />
                <AvatarFallback className={
                  conversation.with.role === 'admin' ? 'bg-emerald-500 text-white' : ''
                }>
                  {conversation.with.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div 
              className={`whatsapp-message ${
                message.sender === 'user' 
                  ? 'whatsapp-user-message' 
                  : 'whatsapp-other-message'
              }`}
            >
              {message.sender === 'user' && <div className="whatsapp-tail-out"></div>}
              {message.sender !== 'user' && <div className="whatsapp-tail-in"></div>}
              
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              <div className="whatsapp-message-time">
                {formatTime(message.timestamp)}
                {renderMessageStatus(message)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
