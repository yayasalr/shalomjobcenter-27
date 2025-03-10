
import React, { useState, useMemo, useEffect } from 'react';
import { Conversation } from './types';
import { AllUsersDialog } from './AllUsersDialog';
import { Status } from './tabs/status/types';
import ConversationTabsNav from './ConversationTabsNav';
import SearchInput from './SearchInput';
import NewConversationButton from './NewConversationButton';
import ChatsTabContent from './tabs/ChatsTabContent';
import StatusTabContent from './tabs/StatusTabContent';
import CallsTabContent from './tabs/CallsTabContent';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSelectConversation: (conversation: Conversation) => void;
  getUnreadCount: (conversation: Conversation) => number;
  updateConversationWithMessage?: (conversationId: string, message: any) => void;
  setConversations?: (conversations: Conversation[]) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  searchQuery,
  setSearchQuery,
  handleSelectConversation,
  getUnreadCount,
  updateConversationWithMessage,
  setConversations
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('chats');
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
  
  const [statuses, setStatuses] = useState<Status[]>(() => {
    const now = new Date();
    
    return [
      {
        id: 1,
        user: "Marie Dupont",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 30),
        content: "En réunion toute la journée, merci de me contacter par email.",
        image: "/placeholder.svg" // Add default image
      },
      {
        id: 2,
        user: "Thomas Martin",
        avatar: "/placeholder.svg",
        isViewed: true,
        timestamp: new Date(now.getTime() - 1000 * 60 * 120),
        image: "/placeholder.svg"
      },
      {
        id: 3,
        user: "Sophie Bernard",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 240),
        content: "Vacances en Italie! 🌞🍕",
        image: "/placeholder.svg"
      }
    ];
  });

  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const mockOnlineStatus = () => {
      const online: Record<string, boolean> = {};
      conversations.forEach(conv => {
        online[conv.with.id] = Math.random() > 0.3; // 70% chance d'être en ligne
      });
      setOnlineUsers(online);
    };
    
    mockOnlineStatus();
    const interval = setInterval(mockOnlineStatus, 60000); // Actualiser toutes les minutes
    
    return () => clearInterval(interval);
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (conversation) => 
        conversation.with.name.toLowerCase().includes(query) ||
        (conversation.lastMessage.content && 
         conversation.lastMessage.content.toLowerCase().includes(query))
    );
  }, [conversations, searchQuery]);

  const handleViewStatus = (status: Status) => {
    setStatuses(currentStatuses => 
      currentStatuses.map(s => 
        s.id === status.id ? { ...s, isViewed: true } : s
      )
    );
  };

  const handleStatusCreated = (newStatus: Status) => {
    setStatuses(currentStatuses => [newStatus, ...currentStatuses]);
  };

  const handleSelectUser = (user: any) => {
    console.log("Selected user for new conversation:", user);
    
    // Vérifier si une conversation existe déjà avec cet utilisateur
    const existingConversation = conversations.find(
      conv => conv.with.id === user.id
    );
    
    if (existingConversation) {
      console.log("Conversation existante trouvée:", existingConversation);
      handleSelectConversation(existingConversation);
    } else if (user && user.id && setConversations) {
      // Créer une nouvelle conversation
      const newConversation: Conversation = {
        id: `conv-${user.id}-${uuidv4()}`,
        with: {
          id: user.id,
          name: user.name,
          avatar: user.avatar || '/placeholder.svg',
          role: user.role || 'user',
        },
        messages: [
          {
            id: `welcome-${Date.now()}`,
            content: `Bonjour ! Comment puis-je vous aider aujourd'hui ?`,
            timestamp: new Date(),
            read: true,
            sender: user.id === 'admin' ? 'admin' : 'other',
          }
        ],
        lastMessage: {
          content: `Bonjour ! Comment puis-je vous aider aujourd'hui ?`,
          timestamp: new Date(),
          read: true,
          sender: user.id === 'admin' ? 'admin' : 'other',
        }
      };
      
      // Mettre à jour la liste des conversations
      const updatedConversations = [...conversations, newConversation];
      setConversations(updatedConversations);
      
      // Sauvegarder dans le localStorage si l'utilisateur est connecté
      if (user) {
        const key = `conversations_${user?.id}`;
        localStorage.setItem(key, JSON.stringify(updatedConversations));
      }
      
      // Sélectionner la nouvelle conversation
      handleSelectConversation(newConversation);
      
      toast.success(`Nouvelle conversation avec ${user.name} créée`);
    }
    
    setShowAllUsers(false);
  };

  return (
    <div className="flex flex-col h-full">
      <ConversationTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'chats' && (
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      )}
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chats' && (
          <ChatsTabContent 
            filteredConversations={filteredConversations}
            selectedConversation={selectedConversation}
            handleSelectConversation={handleSelectConversation}
            getUnreadCount={getUnreadCount}
            onlineUsers={onlineUsers}
          />
        )}
        
        {activeTab === 'statuses' && (
          <StatusTabContent 
            statuses={statuses}
            onViewStatus={handleViewStatus}
            onStatusCreated={handleStatusCreated}
          />
        )}
        
        {activeTab === 'calls' && (
          <CallsTabContent calls={[]} />
        )}
      </div>
      
      {activeTab === 'chats' && (
        <NewConversationButton onClick={() => setShowAllUsers(true)} />
      )}
      
      <AllUsersDialog
        onOpenChange={setShowAllUsers}
        open={showAllUsers}
        onSelectUser={handleSelectUser}
        currentUserId={user?.id}
        conversations={conversations}
      />
    </div>
  );
};

export default ConversationList;
