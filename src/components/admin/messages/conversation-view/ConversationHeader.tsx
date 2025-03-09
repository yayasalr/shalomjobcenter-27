
import React from 'react';
import { Conversation } from '@/components/messages/types';
import ConversationHeader from '@/components/messages/ConversationHeader';

interface ConversationHeaderProps {
  conversation: Conversation;
  isOnline: boolean;
  onBackClick: () => void;
}

const AdminConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  isOnline,
  onBackClick
}) => {
  return (
    <ConversationHeader 
      conversation={conversation}
      isOnline={isOnline}
      onBack={onBackClick}
    />
  );
};

export default AdminConversationHeader;
