
import React from 'react';
import { Message } from '@/components/messages/types';
import { Avatar } from '@/components/ui/avatar';
import { Check, CheckCheck, Image, Mic, Play } from 'lucide-react';

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
  const isAdmin = message.sender === 'admin';
  
  // Determine message type
  const getMessageType = (content: string): 'text' | 'image' | 'audio' => {
    if (content.startsWith('data:image') || content.includes('image-message:')) {
      return 'image';
    } else if (content.includes('audio-message:')) {
      return 'audio';
    }
    return 'text';
  };
  
  const extractImageUrl = (content: string): string => {
    if (content.startsWith('data:image')) {
      return content;
    } else if (content.includes('image-message:')) {
      return content.replace('image-message:', '').trim();
    }
    return '/placeholder.svg';
  };
  
  const extractAudioInfo = (content: string): { duration: string } => {
    const durationMatch = content.match(/\((\d+)s\)/);
    const duration = durationMatch ? durationMatch[1] : "0";
    return { duration };
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };
  
  const messageType = getMessageType(message.content);

  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-4 px-2`}>
      {!isAdmin && (
        <Avatar className="h-10 w-10 mr-2 mt-1 flex-shrink-0">
          <img src={senderAvatar || "/placeholder.svg"} alt={senderName} />
        </Avatar>
      )}
      
      <div className={`whatsapp-message max-w-[75%] ${isAdmin ? 'whatsapp-user-message' : 'whatsapp-other-message'}`}>
        {isAdmin && <div className="whatsapp-tail-out"></div>}
        {!isAdmin && <div className="whatsapp-tail-in"></div>}
        
        {messageType === 'text' && (
          <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
        )}
        
        {messageType === 'image' && (
          <div className="message-image-container">
            <img 
              src={extractImageUrl(message.content)} 
              alt="Image partagée" 
              className="message-image rounded-md max-w-full" 
            />
            <Image className="absolute bottom-2 right-2 text-white h-4 w-4" />
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
            <Mic className="ml-1 h-4 w-4" />
          </div>
        )}
        
        <div className="whatsapp-message-time">
          {formatTime(new Date(message.timestamp))}
          {isAdmin && (
            <span className="whatsapp-tick">
              {message.read ? 
                <CheckCheck size={14} className="whatsapp-read-tick" /> : 
                <Check size={14} className="whatsapp-single-tick" />
              }
            </span>
          )}
        </div>
      </div>
      
      {isAdmin && (
        <Avatar className="h-10 w-10 ml-2 mt-1 flex-shrink-0">
          <img src="/lovable-uploads/94c4ec86-49e9-498e-8fd3-ecdc693ca9fd.png" alt="Admin" />
        </Avatar>
      )}
    </div>
  );
};
