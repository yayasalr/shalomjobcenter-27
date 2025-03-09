
import React, { useEffect } from 'react';
import { Conversation } from '@/components/messages/types';
import AdminMessageInput from '../AdminMessageInput';
import ConversationHeader from '@/components/messages/ConversationHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from '@/components/messages/MessageBubble';

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
  // Handler pour le bouton retour sur mobile
  const handleBackClick = () => {
    const conversationList = document.querySelector('.grid-cols-1.md\\:grid-cols-3 > div:first-child');
    const conversationView = document.querySelector('.grid-cols-1.md\\:grid-cols-3 > div:last-child');
    
    if (conversationList && conversationView && window.innerWidth < 768) {
      conversationList.classList.remove('hidden');
      conversationView.classList.add('hidden');
    }
  };
  
  useEffect(() => {
    // Simulated websocket connection for message updates
    const intervalId = setInterval(() => {
      window.dispatchEvent(new CustomEvent('admin-messages-updated'));
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation sélectionnée</h3>
          <p className="text-gray-500">Sélectionnez une conversation pour commencer à discuter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-2 flex flex-col h-full bg-white">
      <ConversationHeader 
        conversation={conversation}
        isOnline={isOnline}
        onBack={handleBackClick}
      />
      
      <ScrollArea className="flex-1 p-4 bg-gray-50">
        <div className="space-y-2">
          {conversation.messages.map((message) => (
            <MessageBubble 
              key={message.id}
              message={message}
              isUser={message.sender === 'admin'}
            />
          ))}
        </div>
      </ScrollArea>
      
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
