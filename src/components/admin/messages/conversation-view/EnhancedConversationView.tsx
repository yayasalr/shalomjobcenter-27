
import React, { useEffect } from 'react';
import { Conversation } from '@/components/messages/types';
import AdminMessageInput from '../AdminMessageInput';
import { ConversationHeader } from './ConversationHeader';
import { MessageArea } from './MessageArea';
import { EmptyConversationState } from './EmptyConversationState';

interface EnhancedConversationViewProps {
  conversation: Conversation | null;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isSending: boolean;
  isOnline: boolean;
  quickResponses: string[];
  onQuickResponseSelect: (text: string) => void;
  onAddQuickResponse: (text: string) => void;
  onRemoveQuickResponse: (index: number) => void;
  isPreviewMode: boolean;
  previewMessage: () => void;
  sendFromPreview: () => void;
  cancelPreview: () => void;
}

export const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isSending,
  isOnline,
  quickResponses,
  onQuickResponseSelect,
  onAddQuickResponse,
  onRemoveQuickResponse,
  isPreviewMode,
  previewMessage,
  sendFromPreview,
  cancelPreview
}) => {
  // Handler pour le bouton retour sur mobile
  const handleBackClick = () => {
    const conversationList = document.querySelector('.grid-cols-1.md\\:grid-cols-3 > div:first-child');
    const conversationView = document.querySelector('.grid-cols-1.md\\:grid-cols-3 > div:last-child');
    
    if (conversationList && conversationView && window.innerWidth < 768) {
      conversationList.classList.remove('hidden');
      conversationView.classList.add('hidden');
    }
  };
  
  // Effet pour créer un "canal" de communication WebSocket simulé
  useEffect(() => {
    // Configurer une vérification périodique pour les nouveaux messages
    const intervalId = setInterval(() => {
      // Cette fonction serait remplacée par une véritable connexion WebSocket
      // pour l'instant, nous simulons une mise à jour périodique
      
      // Déclencher l'événement personnalisé pour notifier les mises à jour
      window.dispatchEvent(new CustomEvent('admin-messages-updated'));
      
    }, 3000); // Vérifier toutes les 3 secondes
    
    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, []);

  if (!conversation) {
    return <EmptyConversationState />;
  }

  return (
    <div className="col-span-2 flex flex-col h-full whatsapp-container">
      <ConversationHeader 
        conversation={conversation}
        isOnline={isOnline}
        onBackClick={handleBackClick}
      />
      
      <MessageArea 
        messages={conversation.messages}
        senderAvatar={conversation.with.avatar || ''}
        senderName={conversation.with.name}
      />
      
      <AdminMessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        conversation={conversation}
        isSending={isSending}
        quickResponses={quickResponses}
        onQuickResponseSelect={onQuickResponseSelect}
        onAddQuickResponse={onAddQuickResponse}
        onRemoveQuickResponse={onRemoveQuickResponse}
        isPreviewMode={isPreviewMode}
        previewMessage={previewMessage}
        sendFromPreview={sendFromPreview}
        cancelPreview={cancelPreview}
      />
    </div>
  );
};
