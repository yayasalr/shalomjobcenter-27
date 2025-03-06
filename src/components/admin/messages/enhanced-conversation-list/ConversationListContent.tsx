
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/components/messages/types';
import { ConversationListItem } from '../ConversationListItem';
import { EmptyState } from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

interface ConversationListContentProps {
  filteredConversations: Conversation[];
  selectedConversation: Conversation | null;
  handleSelectConversation: (conversation: Conversation) => void;
  getUnreadCount: (conversation: Conversation) => number;
  onlineUsers: Record<string, boolean>;
  markedImportant: Record<string, boolean>;
  toggleImportant: (conversationId: string) => void;
  filter: 'all' | 'unread' | 'important';
  searchQuery?: string;
  isLoading?: boolean;
}

// Composant pour l'état de chargement
const LoadingState = () => (
  <div className="space-y-3 p-4">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export const ConversationListContent: React.FC<ConversationListContentProps> = ({
  filteredConversations,
  selectedConversation,
  handleSelectConversation,
  getUnreadCount,
  onlineUsers,
  markedImportant,
  toggleImportant,
  filter,
  searchQuery = '',
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <ScrollArea className="h-[calc(100vh-380px)]">
        <LoadingState />
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-380px)]">
      {filteredConversations.length > 0 ? (
        filteredConversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedConversation?.id === conversation.id}
            unreadCount={getUnreadCount(conversation)}
            onSelect={() => handleSelectConversation(conversation)}
            isOnline={onlineUsers[conversation.with.id] || false}
            isImportant={!!markedImportant[conversation.id]}
            onToggleImportant={() => toggleImportant(conversation.id)}
          />
        ))
      ) : (
        <EmptyState filter={filter} hasSearchQuery={!!searchQuery.trim()} />
      )}
    </ScrollArea>
  );
};
