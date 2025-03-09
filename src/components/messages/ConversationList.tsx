
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Conversation } from './types';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { toast } from 'sonner';

// Import the components we just created
import ConversationHeader from './ConversationHeader';
import ConversationTabsNav from './ConversationTabsNav';
import ChatsTabContent from './tabs/ChatsTabContent';
import StatusTabContent from './tabs/StatusTabContent';
import CallsTabContent from './tabs/CallsTabContent';

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
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  
  // Statuts pour l'onglet Status
  const [statuses, setStatuses] = useState<any[]>([]);
  
  // Appels pour l'onglet Calls
  const [calls, setCalls] = useState<any[]>([]);
  
  // Initialiser les données de démonstration au chargement du composant
  useEffect(() => {
    initializeData();
  }, [conversations]);
  
  // Fonction d'initialisation des données de démonstration
  const initializeData = () => {
    if (conversations.length === 0) return;
    
    // Générer des utilisateurs en ligne aléatoires
    const online: Record<string, boolean> = {};
    conversations.forEach(conv => {
      online[conv.id] = Math.random() > 0.5;
    });
    setOnlineUsers(online);
    
    // Générer des statuts aléatoires basés sur les conversations
    const now = new Date();
    const randomStatuses = conversations
      .filter(() => Math.random() > 0.3) // Prendre un sous-ensemble aléatoire
      .map((conv, index) => ({
        id: index + 1,
        user: conv.with.name,
        avatar: conv.with.avatar || '/placeholder.svg',
        isViewed: Math.random() > 0.5,
        timestamp: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000), // Dans les dernières 24h
        content: Math.random() > 0.5 
          ? "Statut de " + conv.with.name 
          : undefined,
        image: Math.random() > 0.5 
          ? "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
          : undefined
      }));
    
    // S'assurer qu'il y a au moins quelques statuts
    if (randomStatuses.length < 3) {
      randomStatuses.push(
        {
          id: 1001,
          user: "Marie Dupont",
          avatar: "/placeholder.svg",
          isViewed: false,
          timestamp: new Date(now.getTime() - 1000 * 60 * 30),
          content: "Bonjour à tous! Notre nouvelle politique de sécurité est maintenant disponible."
        },
        {
          id: 1002,
          user: "Jean Martin",
          avatar: "/placeholder.svg",
          isViewed: true,
          timestamp: new Date(now.getTime() - 1000 * 60 * 120),
          image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
        }
      );
    }
    
    setStatuses(randomStatuses);
    
    // Générer un historique d'appels aléatoire basé sur les conversations
    const randomCalls = conversations
      .filter(() => Math.random() > 0.2) // Prendre un sous-ensemble aléatoire
      .map((conv, index) => ({
        id: index + 1,
        user: conv.with.name,
        avatar: conv.with.avatar || '/placeholder.svg',
        type: Math.random() > 0.5 ? 'incoming' : 'outgoing' as const,
        timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Dans la dernière semaine
        missed: Math.random() > 0.7,
        isVideo: Math.random() > 0.7
      }));
    
    // S'assurer qu'il y a au moins quelques appels
    if (randomCalls.length < 3) {
      randomCalls.push(
        {
          id: 1001,
          user: "Marie Dupont",
          avatar: "/placeholder.svg",
          type: "incoming" as const,
          timestamp: new Date(now.getTime() - 1000 * 60 * 15),
          missed: false,
          isVideo: false
        },
        {
          id: 1002,
          user: "Jean Martin",
          avatar: "/placeholder.svg",
          type: "outgoing" as const,
          timestamp: new Date(now.getTime() - 1000 * 60 * 60),
          missed: true,
          isVideo: true
        }
      );
    }
    
    setCalls(randomCalls);
  };
  
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

  return (
    <div className="border-r h-full flex flex-col bg-white md:rounded-l-lg shadow-sm">
      {/* Header with search */}
      <ConversationHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsProfileOpen={setIsProfileOpen}
      />
      
      {/* Tabs container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Tab buttons */}
        <ConversationTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Tab contents */}
        <TabsContent value="chats" className="flex-1 flex flex-col px-0 py-0 mt-0">
          <ChatsTabContent
            filteredConversations={filteredConversations}
            selectedConversation={selectedConversation}
            handleSelectConversation={handleSelectConversation}
            getUnreadCount={getUnreadCount}
            onlineUsers={onlineUsers}
          />
        </TabsContent>
        
        <TabsContent value="status" className="flex-1 flex flex-col px-0 py-0 mt-0">
          <StatusTabContent statuses={statuses} />
        </TabsContent>
        
        <TabsContent value="calls" className="flex-1 flex flex-col px-0 py-0 mt-0">
          <CallsTabContent calls={calls} />
        </TabsContent>
      </Tabs>
      
      {/* Profile dialog would go here */}
    </div>
  );
};

export default ConversationList;
