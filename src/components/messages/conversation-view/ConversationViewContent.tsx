
import React, { useEffect, useRef, useCallback } from 'react';
import { Conversation } from '../types';
import ConversationHeader from '../ConversationHeader';
import MessageInput from '../MessageInput';
import MessageArea from './MessageArea';
import SearchBar from './SearchBar';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FavoriteMessages from '../FavoriteMessages';
import MessageShareDialog from '../MessageShareDialog';

interface ConversationViewContentProps {
  conversation: Conversation;
  conversations: Conversation[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isOnline: boolean;
  onBack?: () => void;
  updateConversationWithMessage: (conversationId: string, message: any) => void;
  // Props for features
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  reactions: Record<string, any[]>;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  favorites: any[];
  addFavorite: (message: any, conversationId: string, conversationName: string) => void;
  removeFavorite: (messageId: string) => void;
  isFavorite: (messageId: string) => boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  handleSearch: (query: string) => void;
  clearSearch: () => void;
  messageToShare: any;
  isShareDialogOpen: boolean;
  selectedConversations: string[];
  openShareDialog: (message: any) => void;
  closeShareDialog: () => void;
  toggleConversationSelection: (id: string) => void;
  shareMessage: () => void;
  forwardRef: React.ForwardedRef<HTMLDivElement>;
}

const ConversationViewContent: React.FC<ConversationViewContentProps> = ({
  conversation,
  conversations,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isOnline,
  onBack,
  updateConversationWithMessage,
  showSearch,
  setShowSearch,
  showFavorites,
  setShowFavorites,
  reactions,
  addReaction,
  removeReaction,
  favorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  searchQuery,
  setSearchQuery,
  searchResults,
  handleSearch,
  clearSearch,
  messageToShare,
  isShareDialogOpen,
  selectedConversations,
  openShareDialog,
  closeShareDialog,
  toggleConversationSelection,
  shareMessage,
  forwardRef
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

  // Apply search when query changes
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, handleSearch]);

  // Navigation to selected conversation
  const navigateToConversation = (conversationId: string) => {
    // This function will be implemented in the application logic
    console.log(`Navigate to conversation ${conversationId}`);
    setShowFavorites(false);
  };

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader 
        conversation={conversation}
        isOnline={isOnline}
        onBack={onBack}
        onSearch={() => setShowSearch(true)}
        onShowFavorites={() => setShowFavorites(true)}
      />
      
      {/* Search bar */}
      {showSearch && (
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          onClose={() => setShowSearch(false)}
        />
      )}
      
      {/* Message area with ref forwarding */}
      <div ref={forwardRef}>
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
      </div>
      
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={() => {
          handleSendMessage();
          // Ensure scroll to bottom happens after sending the message
          setTimeout(scrollToBottom, 100);
        }}
        placeholder="Écrivez un message..."
      />
      
      {/* Message sharing dialog */}
      <MessageShareDialog
        message={messageToShare}
        isOpen={isShareDialogOpen}
        onClose={closeShareDialog}
        conversations={conversations}
        selectedConversations={selectedConversations}
        onToggleConversation={toggleConversationSelection}
        onShare={shareMessage}
      />
      
      {/* Favorites dialog */}
      <Dialog open={showFavorites} onOpenChange={setShowFavorites}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <FavoriteMessages
            favorites={favorites}
            onRemoveFavorite={removeFavorite}
            onNavigateToConversation={navigateToConversation}
            onClose={() => setShowFavorites(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConversationViewContent;
