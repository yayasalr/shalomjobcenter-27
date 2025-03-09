
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
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

  // Handle image selection
  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  // Clear selected image
  const handleClearImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setImageFile(null);
  };

  // Custom send handler to include image
  const handleSendWithImage = () => {
    if (imageFile) {
      // In a real app, you would upload the image to a server
      // and then get a URL back. For demo purposes, we'll use the
      // object URL we created locally.
      const imageUrl = selectedImage;
      
      // Call the original send handler, which will be enhanced in
      // useMessageSender.ts to handle the image parameter
      handleSendMessage();
      
      // Clear the image after sending
      handleClearImage();
    } else {
      // Just text, no image
      handleSendMessage();
    }
  };

  return (
    <ConversationViewContent
      conversation={conversation}
      conversations={conversations}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={handleSendWithImage}
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
      // Image handling
      selectedImage={selectedImage}
      onImageSelect={handleImageSelect}
      onClearImage={handleClearImage}
    />
  );
});

// Add display name
ConversationView.displayName = "ConversationView";

export default ConversationView;
