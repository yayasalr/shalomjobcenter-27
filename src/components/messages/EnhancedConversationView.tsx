
import React, { useRef } from 'react';
import ConversationView from './ConversationView';
import ScrollNavigator from './ScrollNavigator';
import { Conversation } from './types';

interface EnhancedConversationViewProps {
  conversation: Conversation;
  conversations: Conversation[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isOnline: boolean;
  onBack?: () => void;
  updateConversationWithMessage: (conversationId: string, message: any) => void;
}

const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = (props) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="relative h-full">
      <ConversationView 
        {...props} 
        ref={messageContainerRef}
      />
      <ScrollNavigator containerRef={messageContainerRef} />
    </div>
  );
};

export default EnhancedConversationView;
