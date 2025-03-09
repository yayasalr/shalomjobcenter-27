
import React, { useEffect, useRef } from 'react';
import { Conversation } from '@/components/messages/types';
import AdminMessageInput from '../AdminMessageInput';
import ConversationHeader from '@/components/messages/ConversationHeader';
import MessageBubble from '@/components/messages/MessageBubble';
import EmptyConversationState from '../EmptyConversationState';

interface EnhancedConversationViewProps {
  conversation: Conversation | null;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isSending: boolean;
  isOnline: boolean;
  quickResponses: string[];
  onQuickResponseSelect: (text: string) => void;
  onAddQuickResponse: (text: string) => void;
  onRemoveQuickResponse: (index: number) => void;
  isPreviewMode: boolean;
  previewMessage: () => void;
  sendFromPreview: () => void;
  cancelPreview: () => void;
}

export const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isSending,
  isOnline,
  quickResponses,
  onQuickResponseSelect,
  onAddQuickResponse,
  onRemoveQuickResponse,
  isPreviewMode,
  previewMessage,
  sendFromPreview,
  cancelPreview
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handler pour le bouton retour sur mobile
  const handleBackClick = () => {
    const conversationList = document.querySelector('.grid-cols-1.md\\:grid-cols-3 > div:first-child');
    const conversationView = document.querySelector('.grid-cols-1.md\\:grid-cols-3 > div:last-child');
    
    if (conversationList && conversationView && window.innerWidth < 768) {
      conversationList.classList.remove('hidden');
      conversationView.classList.add('hidden');
    }
  };
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  if (!conversation) {
    return <EmptyConversationState />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <ConversationHeader 
        conversation={conversation}
        isOnline={isOnline}
        onBack={handleBackClick}
      />
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {conversation.messages.map((message) => (
          <MessageBubble 
            key={message.id}
            message={message}
            isUser={message.sender === 'admin'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <AdminMessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        conversation={conversation}
        isSending={isSending}
        quickResponses={quickResponses}
        onQuickResponseSelect={onQuickResponseSelect}
        onAddQuickResponse={onAddQuickResponse}
        onRemoveQuickResponse={onRemoveQuickResponse}
        isPreviewMode={isPreviewMode}
        previewMessage={previewMessage}
        sendFromPreview={sendFromPreview}
        cancelPreview={cancelPreview}
      />
    </div>
  );
};
