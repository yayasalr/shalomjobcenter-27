
import React from 'react';
import { EnhancedConversationList } from '@/components/admin/messages/EnhancedConversationList';
import { EnhancedConversationView } from '@/components/admin/messages/conversation-view/EnhancedConversationView';
import { WhatsAppEmptyState } from '@/components/admin/messages/WhatsAppEmptyState';
import { UsersList } from '@/components/admin/messages/UsersList';
import useUserSelection from '@/hooks/admin/useUserSelection';

interface AdminMessagesContainerProps {
  conversations: any[];
  selectedConversation: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: 'all' | 'unread' | 'important';
  setFilter: (filter: any) => void;
  handleSelectConversation: (conversation: any) => void;
  getUnreadCount: (conversation: any) => number;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  sendingMessage: boolean;
  typedOnlineUsers: Record<string, boolean>;
  refreshConversations: () => void;
  
  // Advanced messaging props
  advancedSearchQuery: string;
  setAdvancedSearchQuery: (query: string) => void;
  isAdvancedSearchOpen: boolean;
  setIsAdvancedSearchOpen: (isOpen: boolean) => void;
  searchResults: any[];
  performAdvancedSearch: any;
  quickResponses: string[];
  applyQuickResponse: (text: string) => void;
  addQuickResponse: (text: string) => void;
  removeQuickResponse: (index: number) => void;
  markedImportant: Record<string, boolean>;
  toggleImportant: (conversationId: string) => void;
}

const AdminMessagesContainer: React.FC<AdminMessagesContainerProps> = ({
  conversations,
  selectedConversation,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  handleSelectConversation,
  getUnreadCount,
  newMessage,
  setNewMessage,
  handleSendMessage,
  sendingMessage,
  typedOnlineUsers,
  refreshConversations,
  
  // Advanced messaging props
  advancedSearchQuery,
  setAdvancedSearchQuery,
  isAdvancedSearchOpen,
  setIsAdvancedSearchOpen,
  searchResults,
  performAdvancedSearch,
  quickResponses,
  applyQuickResponse,
  addQuickResponse,
  removeQuickResponse,
  markedImportant,
  toggleImportant
}) => {
  const {
    showUsersList,
    setShowUsersList,
    handleCreateNewConversation,
    handleSelectUser
  } = useUserSelection(conversations, handleSelectConversation, refreshConversations);

  return (
    <div className="h-[calc(100vh-64px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        <EnhancedConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          handleSelectConversation={handleSelectConversation}
          getUnreadCount={getUnreadCount}
          onlineUsers={typedOnlineUsers}
          markedImportant={markedImportant}
          toggleImportant={toggleImportant}
          isAdvancedSearchOpen={isAdvancedSearchOpen}
          setIsAdvancedSearchOpen={setIsAdvancedSearchOpen}
          advancedSearchQuery={advancedSearchQuery}
          setAdvancedSearchQuery={setAdvancedSearchQuery}
          searchResults={searchResults}
          performAdvancedSearch={performAdvancedSearch}
          handleCreateNewConversation={handleCreateNewConversation}
        />
        
        <div className="col-span-2">
          {selectedConversation ? (
            <EnhancedConversationView
              conversation={selectedConversation}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              isSending={sendingMessage}
              isOnline={selectedConversation ? typedOnlineUsers[selectedConversation.with.id] || false : false}
              quickResponses={quickResponses}
              onQuickResponseSelect={applyQuickResponse}
              onAddQuickResponse={addQuickResponse}
              onRemoveQuickResponse={removeQuickResponse}
              isPreviewMode={false}
              previewMessage={() => {}}
              sendFromPreview={() => {}}
              cancelPreview={() => {}}
            />
          ) : (
            <WhatsAppEmptyState />
          )}
        </div>
      </div>
      
      {showUsersList && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Nouvelle conversation</h3>
            <p className="mb-4">Sélectionnez un utilisateur pour commencer une nouvelle conversation.</p>
            
            <UsersList onSelectUser={handleSelectUser} onClose={() => setShowUsersList(false)} />
            
            <div className="mt-4 flex justify-end gap-2">
              <button 
                className="px-4 py-2 rounded border hover:bg-gray-100"
                onClick={() => setShowUsersList(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessagesContainer;
