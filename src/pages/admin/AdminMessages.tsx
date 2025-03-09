
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Card, CardContent } from "@/components/ui/card";
import { useAdminMessages } from '@/hooks/useAdminMessages';
import { EnhancedConversationList } from '@/components/admin/messages/EnhancedConversationList';
import { EnhancedConversationView } from '@/components/admin/messages/conversation-view/EnhancedConversationView';
import { useAdvancedMessaging } from '@/hooks/messages/useAdvancedMessaging';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AdminMessages: React.FC = () => {
  const {
    conversations,
    selectedConversation,
    newMessage,
    searchQuery,
    filter,
    setNewMessage,
    setSearchQuery,
    setFilter,
    handleSendMessage,
    handleSelectConversation,
    getUnreadCount,
    sendingMessage
  } = useAdminMessages();
  
  const [showNewConversationOption, setShowNewConversationOption] = useState(false);
  
  // Utiliser les fonctionnalités simplifiées de messagerie
  const {
    onlineUsers,
    advancedSearchQuery,
    setAdvancedSearchQuery,
    isAdvancedSearchOpen,
    setIsAdvancedSearchOpen,
    performAdvancedSearch,
    quickResponses,
    applyQuickResponse,
    addQuickResponse,
    removeQuickResponse,
    markedImportant,
    toggleImportant
  } = useAdvancedMessaging(
    conversations,
    selectedConversation,
    handleSendMessage,
    newMessage,
    setNewMessage
  );
  
  // Ensure onlineUsers is correctly typed as a Record<string, boolean>
  const typedOnlineUsers: Record<string, boolean> = onlineUsers as Record<string, boolean>;
  
  // Type for search results
  type SearchResult = { conversation: any; message: any };
  
  // Recherche simple - résultats
  const searchResults: SearchResult[] = advancedSearchQuery 
    ? (performAdvancedSearch(advancedSearchQuery) as unknown as SearchResult[])
    : [];
    
  const handleCreateNewConversation = () => {
    // In a real application, this would open a dialog to select users
    setShowNewConversationOption(true);
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      
      <div className="flex flex-col">
        <AdminTopbar />
        
        <main className="flex flex-1 flex-col p-0">
          <div className="h-[calc(100vh-64px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Liste des conversations simplifiée */}
              <EnhancedConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filter={filter as 'all' | 'unread' | 'important'}
                setFilter={(value) => setFilter(value as any)}
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
                performAdvancedSearch={performAdvancedSearch as any}
                handleCreateNewConversation={handleCreateNewConversation}
              />
              
              {/* Vue de conversation simplifiée */}
              <div className="col-span-2">
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
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Option to create new conversation - appears when "New conversation" button is clicked */}
      {showNewConversationOption && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Nouvelle conversation</h3>
            <p className="mb-4">Sélectionnez un utilisateur pour commencer une nouvelle conversation.</p>
            
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewConversationOption(false)}>
                Annuler
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" /> Créer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
