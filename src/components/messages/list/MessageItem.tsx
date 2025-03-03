
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Image, Mic } from 'lucide-react';
import { Conversation, Message } from '../types';

interface MessageItemProps {
  message: Message;
  conversation: Conversation;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, conversation }) => {
  // Determine the message type (text, image, audio, etc)
  const getMessageType = (content: string): 'text' | 'image' | 'audio' => {
    if (content.startsWith('data:image') || content.includes('image-message:')) {
      return 'image';
    } else if (content.includes('audio-message:')) {
      return 'audio';
    }
    return 'text';
  };

  // Extract image URL from image message
  const extractImageUrl = (content: string): string => {
    if (content.startsWith('data:image')) {
      return content;
    } else if (content.includes('image-message:')) {
      const imageUrl = content.replace('image-message:', '').trim();
      return imageUrl;
    }
    return '/placeholder.svg';
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const renderMessageStatus = (message: Message) => {
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

  const messageType = getMessageType(message.content);
  
  return (
    <div 
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
        
        {messageType === 'text' && (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
        
        {messageType === 'image' && (
          <div className="message-image-container">
            <img 
              src={extractImageUrl(message.content)} 
              alt="Shared" 
              className="message-image rounded-md max-w-full" 
            />
            <Image className="image-icon absolute bottom-2 right-2 text-white h-4 w-4" />
          </div>
        )}
        
        {messageType === 'audio' && (
          <div className="message-audio-container flex items-center">
            <div className="audio-waveform bg-gray-300 h-2 flex-1 rounded-full mx-2">
              <div className="bg-blue-500 h-full w-1/2 rounded-full"></div>
            </div>
            <span className="text-xs">0:07</span>
            <Mic className="audio-icon ml-2 h-4 w-4" />
          </div>
        )}
        
        <div className="whatsapp-message-time">
          {formatTime(message.timestamp)}
          {renderMessageStatus(message)}
        </div>
      </div>
    </div>
  );
};
