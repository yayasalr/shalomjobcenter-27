
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/components/messages/types';
import { ConversationListItem } from '../ConversationListItem';
import { EmptyState } from './EmptyState';

interface ConversationListContentProps {
  filteredConversations: Conversation[];
  selectedConversation: Conversation | null;
  handleSelectConversation: (conversation: Conversation) => void;
  getUnreadCount: (conversation: Conversation) => number;
  onlineUsers: Record<string, boolean>;
  markedImportant: Record<string, boolean>;
  toggleImportant: (conversationId: string) => void;
  filter: 'all' | 'unread' | 'important';
}

export const ConversationListContent: React.FC<ConversationListContentProps> = ({
  filteredConversations,
  selectedConversation,
  handleSelectConversation,
  getUnreadCount,
  onlineUsers,
  markedImportant,
  toggleImportant,
  filter
}) => {
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
        <EmptyState filter={filter} />
      )}
    </ScrollArea>
  );
};
