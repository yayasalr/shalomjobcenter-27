
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Users, MessageCircle, Phone, User, Settings } from 'lucide-react';
import { Conversation } from './types';
import WhatsAppConversationItem from './WhatsAppConversationItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { toast } from 'sonner';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSelectConversation: (conversation: Conversation) => void;
  getUnreadCount: (conversation: Conversation) => number;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  searchQuery,
  setSearchQuery,
  handleSelectConversation,
  getUnreadCount
}) => {
  const [activeTab, setActiveTab] = useState('chats');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Simulation aléatoire de l'état en ligne
  const [onlineUsers] = useState<Record<string, boolean>>(() => {
    const online: Record<string, boolean> = {};
    conversations.forEach(conv => {
      online[conv.id] = Math.random() > 0.5;
    });
    return online;
  });
  
  const filteredConversations = conversations.filter(
    conversation => conversation.with.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileImageUpload = (file: File) => {
    setIsUploading(true);
    
    // This would normally upload the image to a server
    setTimeout(() => {
      toast.success("Photo de profil mise à jour");
      setIsUploading(false);
    }, 1500);
  };

  // Mock statuses for the demo
  const statuses = [
    { id: 1, user: 'John Doe', avatar: '/placeholder.svg', isViewed: false, timestamp: new Date() },
    { id: 2, user: 'Jane Smith', avatar: '/placeholder.svg', isViewed: true, timestamp: new Date() },
    { id: 3, user: 'Bob Johnson', avatar: '/placeholder.svg', isViewed: false, timestamp: new Date() }
  ];

  // Mock call history for the demo
  const calls = [
    { id: 1, user: 'John Doe', avatar: '/placeholder.svg', type: 'incoming', timestamp: new Date(), missed: false },
    { id: 2, user: 'Jane Smith', avatar: '/placeholder.svg', type: 'outgoing', timestamp: new Date(), missed: true },
    { id: 3, user: 'Bob Johnson', avatar: '/placeholder.svg', type: 'incoming', timestamp: new Date(), missed: true }
  ];

  return (
    <div className="border-r h-full flex flex-col bg-white md:rounded-l-lg shadow-sm">
      <div className="p-3 bg-emerald-600 flex items-center justify-between">
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => setIsProfileOpen(true)}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex gap-2">
          <Settings className="h-5 w-5 text-white cursor-pointer" />
        </div>
        
        <div className="relative flex-1 mx-2">
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/90 border-0 focus-visible:ring-0"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 whatsapp-tabs">
          <TabsTrigger value="chats" className="whatsapp-tab">
            <div className="flex flex-col items-center">
              <MessageCircle className="h-5 w-5 mb-1" />
              <span>CHATS</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="status" className="whatsapp-tab">
            <div className="flex flex-col items-center">
              <Users className="h-5 w-5 mb-1" />
              <span>STATUS</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="calls" className="whatsapp-tab">
            <div className="flex flex-col items-center">
              <Phone className="h-5 w-5 mb-1" />
              <span>CALLS</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chats" className="flex-1 flex flex-col px-0 py-0 mt-0">
          <ScrollArea className="flex-1">
            <div className="whatsapp-conversation-list">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aucune conversation trouvée
                </div>
              ) : (
                filteredConversations.map(conversation => (
                  <WhatsAppConversationItem 
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedConversation?.id === conversation.id}
                    unreadCount={getUnreadCount(conversation)}
                    onClick={() => handleSelectConversation(conversation)}
                    isOnline={onlineUsers[conversation.id]}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="status" className="flex-1 flex flex-col px-0 py-0 mt-0">
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="relative mr-3">
                  <Avatar className="h-12 w-12 border-2 border-white">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                    <User className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <div className="font-medium">Mon statut</div>
                  <div className="text-xs text-gray-500">Ajouter un statut</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Mises à jour récentes</h3>
                {statuses.map(status => (
                  <div key={status.id} className="flex items-center py-2 cursor-pointer">
                    <div className="relative mr-3">
                      <Avatar className={`h-12 w-12 ${status.isViewed ? 'border-2 border-gray-300' : 'border-2 border-green-500'}`}>
                        <AvatarImage src={status.avatar} />
                        <AvatarFallback>{status.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="font-medium">{status.user}</div>
                      <div className="text-xs text-gray-500">
                        {status.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="calls" className="flex-1 flex flex-col px-0 py-0 mt-0">
          <ScrollArea className="flex-1">
            <div className="p-4">
              {calls.map(call => (
                <div key={call.id} className="flex items-center py-2 border-b">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={call.avatar} />
                    <AvatarFallback>{call.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{call.user}</div>
                    <div className="flex items-center text-xs">
                      <Phone className={`h-3 w-3 mr-1 ${call.type === 'incoming' ? 'transform rotate-90' : 'transform -rotate-90'} ${call.missed ? 'text-red-500' : 'text-green-500'}`} />
                      <span className={`${call.missed ? 'text-red-500' : 'text-gray-500'}`}>
                        {call.type === 'incoming' ? 'Entrant' : 'Sortant'} • {call.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                  <Phone className="h-5 w-5 text-green-500 cursor-pointer" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Profile dialog would go here, using the user's current ImageUploader component */}
    </div>
  );
};

export default ConversationList;
