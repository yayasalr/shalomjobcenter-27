
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/components/messages/types';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  handleSelectConversation: (conversation: Conversation) => void;
  getUnreadCount: (conversation: Conversation) => number;
  onlineUsers: Record<string, boolean>;
  searchQuery: string;
  formatTime: (date: Date) => string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  handleSelectConversation,
  getUnreadCount,
  onlineUsers,
  searchQuery,
  formatTime
}) => {
  const filteredConversations = conversations.filter(conversation => 
    conversation.with.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className="flex-1">
      {filteredConversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>Aucune conversation trouvée. Utilisez le bouton "Nouvelle conversation" ci-dessous pour en démarrer une.</p>
        </div>
      ) : (
        filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedConversation?.id === conversation.id}
            unreadCount={getUnreadCount(conversation)}
            isOnline={onlineUsers[conversation.with.id] || false}
            onClick={() => handleSelectConversation(conversation)}
            formatTime={formatTime}
          />
        ))
      )}
    </ScrollArea>
  );
};

export default ConversationList;
