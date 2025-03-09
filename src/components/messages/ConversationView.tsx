
import React, { useState, forwardRef } from 'react';
import { Conversation } from './types';
import ConversationViewContent from './conversation-view/ConversationViewContent';
import { useMessageReactions } from '@/hooks/messages/useMessageReactions';
import { useFavoriteMessages } from '@/hooks/messages/useFavoriteMessages';
import { useMessageSearch } from '@/hooks/messages/useMessageSearch';
import { useMessageSharing } from '@/hooks/messages/useMessageSharing';

interface ConversationViewProps {
  conversation: Conversation;
  conversations: Conversation[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isOnline: boolean;
  onBack?: () => void;
  updateConversationWithMessage: (conversationId: string, message: any) => void;
}

const ConversationView = forwardRef<HTMLDivElement, ConversationViewProps>(({
  conversation,
  conversations,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isOnline,
  onBack,
  updateConversationWithMessage
}, ref) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Message reactions
  const { 
    reactions, 
    addReaction, 
    removeReaction,
    loadReactionsFromStorage 
  } = useMessageReactions();
  
  // Favorites
  const { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite 
  } = useFavoriteMessages();
  
  // Message search
  const { 
    searchQuery, 
    setSearchQuery,
    searchResults,
    handleSearch,
    clearSearch
  } = useMessageSearch([conversation]);
  
  // Message sharing
  const {
    messageToShare,
    isShareDialogOpen,
    selectedConversations,
    openShareDialog,
    closeShareDialog,
    toggleConversationSelection,
    shareMessage
  } = useMessageSharing(conversations, updateConversationWithMessage);

  // Load reactions on startup
  React.useEffect(() => {
    loadReactionsFromStorage();
  }, [loadReactionsFromStorage]);

  return (
    <ConversationViewContent
      conversation={conversation}
      conversations={conversations}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={handleSendMessage}
      isOnline={isOnline}
      onBack={onBack}
      updateConversationWithMessage={updateConversationWithMessage}
      showSearch={showSearch}
      setShowSearch={setShowSearch}
      showFavorites={showFavorites}
      setShowFavorites={setShowFavorites}
      reactions={reactions}
      addReaction={addReaction}
      removeReaction={removeReaction}
      favorites={favorites}
      addFavorite={addFavorite}
      removeFavorite={removeFavorite}
      isFavorite={isFavorite}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      searchResults={searchResults}
      handleSearch={handleSearch}
      clearSearch={clearSearch}
      messageToShare={messageToShare}
      isShareDialogOpen={isShareDialogOpen}
      selectedConversations={selectedConversations}
      openShareDialog={openShareDialog}
      closeShareDialog={closeShareDialog}
      toggleConversationSelection={toggleConversationSelection}
      shareMessage={shareMessage}
      forwardRef={ref}
    />
  );
});

// Add display name
ConversationView.displayName = "ConversationView";

export default ConversationView;
