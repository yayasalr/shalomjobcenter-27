
import React from 'react';
import { Message } from '@/components/messages/types';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, CheckCheck } from 'lucide-react';

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
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { 
    addSuffix: true,
    locale: fr
  });

  return (
    <div className={`flex items-start gap-2 mb-4 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      {!isAdmin && (
        <Avatar className="h-10 w-10 border">
          <img src={senderAvatar || "/placeholder.svg"} alt={senderName} />
        </Avatar>
      )}
      
      <div className={`max-w-[75%] ${isAdmin ? 'whatsapp-user-message' : 'whatsapp-other-message'} rounded-lg p-3 shadow-sm relative`}>
        {!isAdmin && (
          <div className="font-medium text-xs text-gray-600 mb-1">{senderName}</div>
        )}
        
        <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
        
        <div className={`text-xs mt-1 flex items-center gap-1 justify-end ${isAdmin ? 'text-gray-500' : 'text-gray-400'}`}>
          <span>{formattedTime}</span>
          {isAdmin && (
            <span className="whatsapp-tick">{message.read ? <CheckCheck size={14} className="whatsapp-read-tick" /> : <Check size={14} className="whatsapp-single-tick" />}</span>
          )}
        </div>
        
        {/* Message tails for WhatsApp style */}
        {isAdmin ? <div className="whatsapp-tail-out"></div> : <div className="whatsapp-tail-in"></div>}
      </div>
      
      {isAdmin && (
        <Avatar className="h-10 w-10 border">
          <img src="/lovable-uploads/94c4ec86-49e9-498e-8fd3-ecdc693ca9fd.png" alt="Admin" />
        </Avatar>
      )}
    </div>
  );
};
