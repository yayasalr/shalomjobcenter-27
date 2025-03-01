
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import useAuth from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';

// Message components
import ConversationList from '@/components/messages/ConversationList';
import ConversationView from '@/components/messages/ConversationView';
import EmptyConversation from '@/components/messages/EmptyConversation';
import NotAuthenticated from '@/components/messages/NotAuthenticated';

const Messages = () => {
  const { user } = useAuth();
  
  // Use the messages hook for all messaging functionality
  const {
    conversations,
    selectedConversation,
    newMessage,
    searchQuery,
    setNewMessage,
    setSearchQuery,
    handleSendMessage,
    handleSelectConversation,
    getUnreadCount
  } = useMessages(user?.id);

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <NotAuthenticated />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 mt-8">Messages</h1>
        
        <Card className="h-[calc(80vh-8rem)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Conversation List */}
            <ConversationList 
              conversations={conversations}
              selectedConversation={selectedConversation}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSelectConversation={handleSelectConversation}
              getUnreadCount={getUnreadCount}
            />
            
            {/* Conversation View */}
            {selectedConversation ? (
              <ConversationView 
                conversation={selectedConversation}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
              />
            ) : (
              <EmptyConversation />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
