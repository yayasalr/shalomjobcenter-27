
import React, { useRef, useCallback, useEffect } from 'react';
import MessageArea from '../MessageArea';
import MessageInput from '../../MessageInput';

interface MessageInteractionAreaProps {
  conversation: any;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  reactions: Record<string, any[]>;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  isFavorite: (messageId: string) => boolean;
  addFavorite: (message: any, conversationId: string, conversationName: string) => void;
  removeFavorite: (messageId: string) => void;
  openShareDialog: (message: any) => void;
  searchResults: any[];
  searchQuery: string;
  // Image handling
  selectedImage?: string | null;
  onImageSelect?: (file: File) => void;
  onClearImage?: () => void;
}

const MessageInteractionArea: React.FC<MessageInteractionAreaProps> = ({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  reactions,
  addReaction,
  removeReaction,
  isFavorite,
  addFavorite,
  removeFavorite,
  openShareDialog,
  searchResults,
  searchQuery,
  selectedImage = null,
  onImageSelect = () => {},
  onClearImage = () => {}
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom (memoized)
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll to bottom when new messages arrive or when conversation changes
  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages, scrollToBottom, conversation.id]);

  // Auto-scroll when sending a new message
  useEffect(() => {
    const messageInputField = document.querySelector('.message-input');
    
    // Add event listener to input field to auto-scroll when user starts typing
    const handleFocus = () => {
      setTimeout(scrollToBottom, 100);
    };
    
    if (messageInputField) {
      messageInputField.addEventListener('focus', handleFocus);
      
      return () => {
        messageInputField.removeEventListener('focus', handleFocus);
      };
    }
  }, [scrollToBottom]);

  return (
    <>
      <MessageArea 
        conversation={conversation}
        reactions={reactions}
        addReaction={addReaction}
        removeReaction={removeReaction}
        isFavorite={isFavorite}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
        openShareDialog={openShareDialog}
        messagesEndRef={messagesEndRef}
        searchResults={searchResults}
        searchQuery={searchQuery}
      />
      
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
        placeholder="Écrivez un message..."
        selectedImage={selectedImage}
        onImageSelect={onImageSelect}
        onClearImage={onClearImage}
      />
    </>
  );
};

export default MessageInteractionArea;
