
import React, { useRef } from 'react';
import { Conversation } from '../types';
import EnhancedMessageBubble from '../EnhancedMessageBubble';

interface MessageAreaProps {
  conversation: Conversation;
  reactions: Record<string, any[]>;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  isFavorite: (messageId: string) => boolean;
  addFavorite: (message: any, conversationId: string, conversationName: string) => void;
  removeFavorite: (messageId: string) => void;
  openShareDialog: (message: any) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  searchResults: any[];
  searchQuery: string;
}

const MessageArea: React.FC<MessageAreaProps> = ({
  conversation,
  reactions,
  addReaction,
  isFavorite,
  addFavorite,
  removeFavorite,
  openShareDialog,
  messagesEndRef,
  searchResults,
  searchQuery
}) => {
  // Determine which messages to display based on search
  const displayMessages = searchQuery && searchResults.length > 0
    ? searchResults[0]?.messages || []
    : conversation.messages;

  return (
    <div className="message-area scrollbar-container">
      {displayMessages.map((message) => (
        <EnhancedMessageBubble 
          key={message.id}
          message={message}
          isUser={message.sender === 'user' || message.sender === 'admin'}
          conversationId={conversation.id}
          conversationName={conversation.with.name}
          messageReactions={reactions[message.id] || []}
          onAddReaction={addReaction}
          onToggleFavorite={() => {
            if (isFavorite(message.id)) {
              removeFavorite(message.id);
            } else {
              addFavorite(message, conversation.id, conversation.with.name);
            }
          }}
          isFavorite={isFavorite(message.id)}
          onShare={() => openShareDialog(message)}
          onForward={() => openShareDialog(message)}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageArea;
