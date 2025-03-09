
import React, { useEffect, useRef } from 'react';
import { Conversation } from './types';
import ConversationHeader from './ConversationHeader';
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble';

interface ConversationViewProps {
  conversation: Conversation;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isOnline: boolean;
  onBack?: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isOnline,
  onBack
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages]);

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader 
        conversation={conversation}
        isOnline={isOnline}
        onBack={onBack}
      />
      
      <div className="message-area">
        {conversation.messages.map((message) => (
          <MessageBubble 
            key={message.id}
            message={message}
            isUser={message.sender === 'user' || message.sender === 'admin'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
        placeholder="Écrivez un message..."
      />
    </div>
  );
};

export default ConversationView;
