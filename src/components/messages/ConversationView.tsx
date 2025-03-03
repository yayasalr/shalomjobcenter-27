
import React from 'react';
import { Conversation } from './types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import WhatsAppHeader from './WhatsAppHeader';

interface ConversationViewProps {
  conversation: Conversation;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isOnline?: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isOnline = Math.random() > 0.5 // Simulation aléatoire de l'état en ligne
}) => {
  return (
    <div className="col-span-2 flex flex-col h-full whatsapp-container">
      <WhatsAppHeader conversation={conversation} isOnline={isOnline} />
      <MessageList conversation={conversation} />
      <MessageInput 
        newMessage={newMessage} 
        setNewMessage={setNewMessage} 
        handleSendMessage={handleSendMessage} 
      />
    </div>
  );
};

export default ConversationView;
