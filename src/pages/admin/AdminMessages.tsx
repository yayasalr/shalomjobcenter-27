
import React, { useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { useAdminMessages } from '@/hooks/useAdminMessages';
import { useAdvancedMessaging } from '@/hooks/messages/useAdvancedMessaging';
import AdminMessagesContainer from '@/components/admin/messages/AdminMessagesContainer';
import { toast } from 'sonner';

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
    sendingMessage,
    refreshConversations
  } = useAdminMessages();
  
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
  
  // Simulation des utilisateurs en ligne
  const mockOnlineUsers = {
    'user1': true,
    'user2': false,
    'user3': true,
    'host1': true
  };
  
  // Combine mock online users with actual online users
  const typedOnlineUsers: Record<string, boolean> = {...onlineUsers, ...mockOnlineUsers};
  
  const searchResults: any[] = advancedSearchQuery 
    ? (performAdvancedSearch(advancedSearchQuery) as unknown as any[])
    : [];
    
  // Display a toast if the component is mounted when the user is in the admin messages page
  useEffect(() => {
    // Check if we're on admin/messages page
    if (window.location.pathname.includes('/admin/messages')) {
      toast.info("Vous pouvez maintenant publier des statuts qui seront visibles pendant 24 heures!");
    }
  }, []);

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      
      <div className="flex flex-col">
        <AdminTopbar />
        
        <main className="flex flex-1 flex-col p-0">
          <AdminMessagesContainer 
            conversations={conversations}
            selectedConversation={selectedConversation}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter as 'all' | 'unread' | 'important'}
            setFilter={setFilter}
            handleSelectConversation={handleSelectConversation}
            getUnreadCount={getUnreadCount}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            sendingMessage={sendingMessage}
            typedOnlineUsers={typedOnlineUsers}
            refreshConversations={refreshConversations}
            
            advancedSearchQuery={advancedSearchQuery}
            setAdvancedSearchQuery={setAdvancedSearchQuery}
            isAdvancedSearchOpen={isAdvancedSearchOpen}
            setIsAdvancedSearchOpen={setIsAdvancedSearchOpen}
            searchResults={searchResults}
            performAdvancedSearch={performAdvancedSearch}
            quickResponses={quickResponses}
            applyQuickResponse={applyQuickResponse}
            addQuickResponse={addQuickResponse}
            removeQuickResponse={removeQuickResponse}
            markedImportant={markedImportant}
            toggleImportant={toggleImportant}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminMessages;
