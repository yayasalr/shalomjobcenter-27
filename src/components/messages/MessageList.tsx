
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {conversation.messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender !== 'user' && (
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarImage src={conversation.with.avatar} />
                <AvatarFallback className={
                  conversation.with.role === 'admin' ? 'bg-blue-500 text-white' : ''
                }>
                  {conversation.with.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div 
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : message.sender === 'admin'
                    ? 'bg-blue-100 text-blue-800 rounded-tl-none'
                    : 'bg-gray-100 text-gray-900 rounded-tl-none'
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' 
                  ? 'text-primary-foreground/70' 
                  : message.sender === 'admin'
                    ? 'text-blue-700'
                    : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
