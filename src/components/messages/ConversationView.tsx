
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { Conversation } from './types';
import ConversationHeader from './ConversationHeader';
import MessageInput from './MessageInput';
import EnhancedMessageBubble from './EnhancedMessageBubble';
import { useMessageReactions } from '@/hooks/messages/useMessageReactions';
import { useFavoriteMessages } from '@/hooks/messages/useFavoriteMessages';
import { useMessageSearch } from '@/hooks/messages/useMessageSearch';
import { useMessageSharing } from '@/hooks/messages/useMessageSharing';
import MessageShareDialog from './MessageShareDialog';
import { Button } from "@/components/ui/button";
import { Search, Star, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FavoriteMessages from './FavoriteMessages';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Réactions aux messages
  const { 
    reactions, 
    addReaction, 
    removeReaction,
    loadReactionsFromStorage 
  } = useMessageReactions();
  
  // Favoris
  const { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite 
  } = useFavoriteMessages();
  
  // Recherche de messages
  const { 
    searchQuery, 
    setSearchQuery,
    searchResults,
    handleSearch,
    clearSearch
  } = useMessageSearch([conversation]);
  
  // Partage de messages
  const {
    messageToShare,
    isShareDialogOpen,
    selectedConversations,
    openShareDialog,
    closeShareDialog,
    toggleConversationSelection,
    shareMessage
  } = useMessageSharing(conversations, updateConversationWithMessage);

  // Charger les réactions au démarrage
  useEffect(() => {
    loadReactionsFromStorage();
  }, [loadReactionsFromStorage]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages]);

  // Appliquer la recherche lors du changement de query
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, handleSearch]);

  // Navigation vers la conversation sélectionnée
  const navigateToConversation = (conversationId: string) => {
    // Cette fonction sera implémentée dans la logique de l'application
    console.log(`Navigate to conversation ${conversationId}`);
    setShowFavorites(false);
  };

  // Filtrer les messages en fonction de la recherche
  const displayMessages = searchQuery && searchResults.length > 0
    ? searchResults[0]?.messages || []
    : conversation.messages;

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader 
        conversation={conversation}
        isOnline={isOnline}
        onBack={onBack}
        onSearch={() => setShowSearch(true)}
        onShowFavorites={() => setShowFavorites(true)}
      />
      
      {/* Barre de recherche */}
      {showSearch && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 border-b">
          <Input
            placeholder="Rechercher dans la conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            autoFocus
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" onClick={clearSearch}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Zone de messages */}
      <div ref={ref} className="message-area scrollbar-container">
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
      
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
        placeholder="Écrivez un message..."
      />
      
      {/* Dialog de partage de message */}
      <MessageShareDialog
        message={messageToShare}
        isOpen={isShareDialogOpen}
        onClose={closeShareDialog}
        conversations={conversations}
        selectedConversations={selectedConversations}
        onToggleConversation={toggleConversationSelection}
        onShare={shareMessage}
      />
      
      {/* Dialog des messages favoris */}
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
});

// Add display name
ConversationView.displayName = "ConversationView";

export default ConversationView;
