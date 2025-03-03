
import React from 'react';
import { Conversation } from './types';
import { MessageItem } from './list/MessageItem';
import { ScrollButtons } from './list/ScrollButtons';
import { useScrollManagement } from './list/useScrollManagement';

interface MessageListProps {
  conversation: Conversation;
}

const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
  const {
    scrollAreaRef,
    messagesEndRef,
    showScrollButtons,
    isAtBottom,
    handleScroll,
    scrollToBottom,
    scrollToTop
  } = useScrollManagement(conversation);

  return (
    <div className="whatsapp-message-area relative flex-1 overflow-hidden">
      <div 
        className="h-full overflow-y-auto px-4 py-2 scrollbar-container" 
        onScroll={handleScroll}
        ref={scrollAreaRef}
      >
        <div className="space-y-2">
          {conversation.messages.map((message) => (
            <MessageItem 
              key={message.id}
              message={message}
              conversation={conversation}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <ScrollButtons 
        showScrollButtons={showScrollButtons}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        scrollToTop={scrollToTop}
      />
    </div>
  );
};

export default MessageList;
