
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FavoriteMessages from '../../FavoriteMessages';
import MessageShareDialog from '../../MessageShareDialog';

interface DialogsContainerProps {
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  favorites: any[];
  removeFavorite: (messageId: string) => void;
  navigateToConversation: (conversationId: string) => void;
  messageToShare: any;
  isShareDialogOpen: boolean;
  selectedConversations: string[];
  closeShareDialog: () => void;
  toggleConversationSelection: (id: string) => void;
  shareMessage: () => void;
  conversations: any[];
}

const DialogsContainer: React.FC<DialogsContainerProps> = ({
  showFavorites,
  setShowFavorites,
  favorites,
  removeFavorite,
  navigateToConversation,
  messageToShare,
  isShareDialogOpen,
  selectedConversations,
  closeShareDialog,
  toggleConversationSelection,
  shareMessage,
  conversations
}) => {
  return (
    <>
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
    </>
  );
};

export default DialogsContainer;
