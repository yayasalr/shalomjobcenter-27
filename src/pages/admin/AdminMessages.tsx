
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, User, MessageSquare } from 'lucide-react';
import ConversationList from '@/components/admin/messages/ConversationList';
import AdminConversationView from '@/components/admin/messages/AdminConversationView';
import SystemMessagesTab from '@/components/admin/messages/SystemMessagesTab';
import ContactSubmissionsTab from '@/components/admin/messages/contact/ContactSubmissionsTab';
import { useAdminMessages } from '@/hooks/useAdminMessages';

const AdminMessages: React.FC = () => {
  const {
    conversations,
    selectedConversation,
    newMessage,
    searchQuery,
    filter,
    totalUnreadCount,
    setNewMessage,
    setSearchQuery,
    setFilter,
    handleSendMessage,
    handleSelectConversation,
    getUnreadCount
  } = useAdminMessages();

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      
      <div className="flex flex-col">
        <AdminTopbar />
        
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Messages</h1>
            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
              {totalUnreadCount} non lus
            </Badge>
          </div>
          
          <Tabs defaultValue="messages" className="w-full">
            <TabsList>
              <TabsTrigger value="messages" className="flex gap-2">
                <Users className="h-4 w-4" />
                Messages des utilisateurs
              </TabsTrigger>
              <TabsTrigger value="system" className="flex gap-2">
                <User className="h-4 w-4" />
                Messages système
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex gap-2">
                <MessageSquare className="h-4 w-4" />
                Formulaires de contact
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="messages" className="space-y-4">
              <Card>
                <CardContent className="p-6 h-[calc(100vh-280px)]">
                  <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-4">
                    {/* Liste des conversations */}
                    <ConversationList
                      conversations={conversations}
                      selectedConversation={selectedConversation}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      filter={filter}
                      setFilter={setFilter}
                      handleSelectConversation={handleSelectConversation}
                      getUnreadCount={getUnreadCount}
                    />
                    
                    {/* Conversation */}
                    <AdminConversationView
                      conversation={selectedConversation}
                      newMessage={newMessage}
                      setNewMessage={setNewMessage}
                      handleSendMessage={handleSendMessage}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="system" className="space-y-4">
              <SystemMessagesTab />
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <ContactSubmissionsTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminMessages;
