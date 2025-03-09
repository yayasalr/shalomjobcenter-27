
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '../types';
import WhatsAppConversationItem from '../WhatsAppConversationItem';
import { AlertCircle } from 'lucide-react';

interface ChatsTabContentProps {
  filteredConversations: Conversation[];
  selectedConversation: Conversation | null;
  handleSelectConversation: (conversation: Conversation) => void;
  getUnreadCount: (conversation: Conversation) => number;
  onlineUsers: Record<string, boolean>;
}

const ChatsTabContent: React.FC<ChatsTabContentProps> = ({
  filteredConversations,
  selectedConversation,
  handleSelectConversation,
  getUnreadCount,
  onlineUsers
}) => {
  return (
    <ScrollArea className="flex-1">
      <div className="whatsapp-conversation-list">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune conversation trouvée. Utilisez le bouton "Nouvelle conversation" ci-dessus pour en démarrer une.
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <WhatsAppConversationItem 
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversation?.id === conversation.id}
              unreadCount={getUnreadCount(conversation)}
              onClick={() => handleSelectConversation(conversation)}
              isOnline={onlineUsers[conversation.with.id]}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatsTabContent;
