
import React from 'react';
import { Message } from '@/components/messages/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Image } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  senderAvatar: string;
  senderName: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  senderAvatar,
  senderName
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const renderMessageStatus = (message: Message) => {
    if (message.sender !== 'admin') return null;
    
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
    <div 
      key={message.id}
      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
    >
      {message.sender !== 'admin' && (
        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
          <AvatarImage src={senderAvatar} />
          <AvatarFallback>
            {senderName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
      <div 
        className={`whatsapp-message max-w-[75%] sm:max-w-[70%] ${
          message.sender === 'admin' 
            ? 'whatsapp-user-message' 
            : 'whatsapp-other-message'
        }`}
      >
        {message.sender === 'admin' && <div className="whatsapp-tail-out"></div>}
        {message.sender !== 'admin' && <div className="whatsapp-tail-in"></div>}
        
        {message.content.startsWith('image-message:') ? (
          <div className="message-image-container">
            <img 
              src={message.content.replace('image-message:', '').trim()} 
              alt="Message Image" 
              className="message-image rounded-md max-w-full" 
            />
            <Image className="image-icon absolute bottom-2 right-2 text-white h-4 w-4" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}
        
        <div className="whatsapp-message-time">
          {formatTime(new Date(message.timestamp))}
          {renderMessageStatus(message)}
          {!message.read && message.sender !== 'admin' && (
            <span className="ml-1 font-medium text-gray-600">• Non lu</span>
          )}
        </div>
      </div>
    </div>
  );
};
