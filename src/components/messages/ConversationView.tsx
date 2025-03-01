
import React from 'react';
import { Conversation } from './types';
import ConversationHeader from './ConversationHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ConversationViewProps {
  conversation: Conversation;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage
}) => {
  return (
    <div className="col-span-2 flex flex-col h-full">
      <ConversationHeader conversation={conversation} />
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
