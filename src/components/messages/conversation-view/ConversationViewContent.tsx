
import React from 'react';
import { Conversation } from '../types';
import ConversationHeader from '../ConversationHeader';
import SearchContainer from './components/SearchContainer';
import MessageInteractionArea from './components/MessageInteractionArea';
import DialogsContainer from './components/DialogsContainer';

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
  // Image handling
  selectedImage?: string | null;
  onImageSelect?: (file: File) => void;
  onClearImage?: () => void;
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
  forwardRef,
  // Image handling
  selectedImage = null,
  onImageSelect = () => {},
  onClearImage = () => {}
}) => {
  // Apply search when query changes
  React.useEffect(() => {
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
      
      <SearchContainer 
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearSearch={clearSearch}
      />
      
      {/* Message area with ref forwarding */}
      <div ref={forwardRef}>
        <MessageInteractionArea 
          conversation={conversation}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          reactions={reactions}
          addReaction={addReaction}
          removeReaction={removeReaction}
          isFavorite={isFavorite}
          addFavorite={addFavorite}
          removeFavorite={removeFavorite}
          openShareDialog={openShareDialog}
          searchResults={searchResults}
          searchQuery={searchQuery}
          selectedImage={selectedImage}
          onImageSelect={onImageSelect}
          onClearImage={onClearImage}
        />
      </div>
      
      <DialogsContainer 
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        favorites={favorites}
        removeFavorite={removeFavorite}
        navigateToConversation={navigateToConversation}
        messageToShare={messageToShare}
        isShareDialogOpen={isShareDialogOpen}
        selectedConversations={selectedConversations}
        closeShareDialog={closeShareDialog}
        toggleConversationSelection={toggleConversationSelection}
        shareMessage={shareMessage}
        conversations={conversations}
      />
    </div>
  );
};

export default ConversationViewContent;
