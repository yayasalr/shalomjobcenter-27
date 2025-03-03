
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Image, Mic, Play } from 'lucide-react';
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
      // Récupérer l'URL de l'image depuis le contenu du message
      const imageUrl = content.replace('image-message:', '').trim();
      return imageUrl;
    }
    return '/placeholder.svg';
  };
  
  // Extract audio info from audio message
  const extractAudioInfo = (content: string): { duration: string } => {
    const durationMatch = content.match(/\((\d+)s\)/);
    const duration = durationMatch ? durationMatch[1] : "0";
    return { duration };
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
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} px-1 sm:px-2 mb-2`}
    >
      {message.sender !== 'user' && (
        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
          <AvatarImage src={conversation.with.avatar} />
          <AvatarFallback className={
            conversation.with.role === 'admin' ? 'bg-emerald-500 text-white' : ''
          }>
            {conversation.with.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
      <div 
        className={`whatsapp-message max-w-[75%] sm:max-w-[70%] ${
          message.sender === 'user' 
            ? 'whatsapp-user-message' 
            : 'whatsapp-other-message'
        }`}
      >
        {message.sender === 'user' && <div className="whatsapp-tail-out"></div>}
        {message.sender !== 'user' && <div className="whatsapp-tail-in"></div>}
        
        {messageType === 'text' && (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}
        
        {messageType === 'image' && (
          <div className="message-image-container">
            <img 
              src={extractImageUrl(message.content)} 
              alt="Image partagée" 
              className="message-image rounded-md max-w-full" 
              onError={(e) => {
                console.error("Erreur de chargement d'image:", e);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <Image className="image-icon absolute bottom-2 right-2 text-white h-4 w-4" />
          </div>
        )}
        
        {messageType === 'audio' && (
          <div className="message-audio-container flex items-center gap-2 p-2">
            <button className="audio-play-button bg-gray-200 rounded-full p-1">
              <Play className="h-4 w-4 fill-current text-blue-500" />
            </button>
            <div className="audio-waveform bg-gray-300 h-2 flex-1 rounded-full">
              <div className="bg-blue-500 h-full w-1/2 rounded-full"></div>
            </div>
            <span className="text-xs">{extractAudioInfo(message.content).duration}s</span>
            <Mic className="audio-icon ml-1 h-4 w-4" />
          </div>
        )}
        
        <div className="whatsapp-message-time">
          {formatTime(new Date(message.timestamp))}
          {renderMessageStatus(message)}
        </div>
      </div>
    </div>
  );
};
