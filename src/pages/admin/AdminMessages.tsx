
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { useAdminMessages } from '@/hooks/useAdminMessages';
import { EnhancedConversationList } from '@/components/admin/messages/EnhancedConversationList';
import { EnhancedConversationView } from '@/components/admin/messages/conversation-view/EnhancedConversationView';
import { useAdvancedMessaging } from '@/hooks/messages/useAdvancedMessaging';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UsersList } from '@/components/admin/messages/UsersList';
import { WhatsAppEmptyState } from '@/components/admin/messages/WhatsAppEmptyState';
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
  
  const [showNewConversationOption, setShowNewConversationOption] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  
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
  
  const typedOnlineUsers: Record<string, boolean> = {...onlineUsers, ...mockOnlineUsers};
  
  const searchResults: any[] = advancedSearchQuery 
    ? (performAdvancedSearch(advancedSearchQuery) as unknown as any[])
    : [];
    
  const handleCreateNewConversation = () => {
    setShowUsersList(true);
  };

  const handleSelectUser = (userId: string, userName: string) => {
    console.log(`Selected user: ${userName} (${userId})`);
    setShowUsersList(false);
    
    // Récupérer les utilisateurs
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Trouver l'utilisateur sélectionné
    const selectedUser = users.find((u: any) => u.id === userId);
    
    if (!selectedUser) {
      toast.error("Utilisateur non trouvé");
      return;
    }
    
    // Créer une nouvelle conversation
    const existingConv = conversations.find(conv => conv.with.id === userId);
    
    if (existingConv) {
      // Si la conversation existe déjà, la sélectionner
      handleSelectConversation(existingConv);
      toast.info(`Conversation avec ${userName} reprise`);
    } else {
      // Sinon, créer une nouvelle conversation
      const newConversation = {
        id: `admin-${userId}-${Date.now()}`,
        with: {
          id: userId,
          name: userName,
          email: selectedUser.email || '',
          avatar: selectedUser.avatar || '/placeholder.svg',
          role: selectedUser.role || 'user',
        },
        lastMessage: {
          content: "Nouvelle conversation",
          timestamp: new Date(),
          read: true,
          sender: 'admin' as const,
        },
        messages: [
          {
            id: `welcome-${Date.now()}`,
            content: `Bienvenue ${userName}! Comment puis-je vous aider ?`,
            timestamp: new Date(),
            read: true,
            sender: 'admin',
          }
        ],
      };
      
      // Mettre à jour le localStorage
      const key = `conversations_${userId}`;
      const userConversation = {
        id: `user-admin-${Date.now()}`,
        with: {
          id: 'admin',
          name: 'Administrateur',
          avatar: '/placeholder.svg',
          role: 'admin',
        },
        lastMessage: {
          content: `Bienvenue ${userName}! Comment puis-je vous aider ?`,
          timestamp: new Date(),
          read: false,
          sender: 'admin',
        },
        messages: [
          {
            id: `welcome-${Date.now()}`,
            content: `Bienvenue ${userName}! Comment puis-je vous aider ?`,
            timestamp: new Date(),
            read: false,
            sender: 'admin',
          }
        ],
      };
      
      const existingConvs = localStorage.getItem(key);
      const userConversations = existingConvs ? JSON.parse(existingConvs) : [];
      userConversations.push(userConversation);
      localStorage.setItem(key, JSON.stringify(userConversations));
      
      // Actualiser les conversations et sélectionner la nouvelle
      refreshConversations();
      
      // Notifier l'utilisateur
      toast.success(`Nouvelle conversation avec ${userName} créée`);
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      
      <div className="flex flex-col">
        <AdminTopbar />
        
        <main className="flex flex-1 flex-col p-0">
          <div className="h-[calc(100vh-64px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
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
          </div>
        </main>
      </div>
      
      {showUsersList && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Nouvelle conversation</h3>
            <p className="mb-4">Sélectionnez un utilisateur pour commencer une nouvelle conversation.</p>
            
            <UsersList onSelectUser={handleSelectUser} onClose={() => setShowUsersList(false)} />
            
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUsersList(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
