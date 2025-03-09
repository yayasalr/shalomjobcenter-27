
import React from 'react';
import { Conversation } from '@/components/messages/types';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { QuickResponseSelector } from './QuickResponseSelector';

interface AdminMessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  conversation: Conversation;
  isSending: boolean;
  quickResponses: string[];
  onQuickResponseSelect: (text: string) => void;
  onAddQuickResponse: (text: string) => void;
  onRemoveQuickResponse: (index: number) => void;
  // Add the missing properties
  isPreviewMode: boolean;
  previewMessage: () => void;
  sendFromPreview: () => void;
  cancelPreview: () => void;
}

const AdminMessageInput: React.FC<AdminMessageInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  conversation,
  isSending,
  quickResponses,
  onQuickResponseSelect,
  onAddQuickResponse,
  onRemoveQuickResponse,
  // Add the missing properties to the destructuring
  isPreviewMode,
  previewMessage,
  sendFromPreview,
  cancelPreview
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="p-3 bg-white border-t">
      <QuickResponseSelector 
        responses={quickResponses}
        onSelect={onQuickResponseSelect}
        onAdd={onAddQuickResponse}
        onRemove={onRemoveQuickResponse}
      />
      
      <div className="message-input-area">
        <div
          className="message-input"
          contentEditable
          onInput={(e) => setNewMessage(e.currentTarget.textContent || '')}
          onKeyDown={handleKeyDown}
          data-placeholder="Écrivez un message..."
          dangerouslySetInnerHTML={{__html: newMessage}}
        />
        
        <Button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isSending}
          className="rounded-full bg-blue-500 hover:bg-blue-600"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {isPreviewMode && (
        <div className="preview-mode bg-gray-100 p-3 mt-2 rounded-md">
          <div className="preview-content mb-2 p-2 bg-white rounded shadow-sm">
            {newMessage}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={sendFromPreview}>Envoyer</Button>
            <Button size="sm" variant="outline" onClick={cancelPreview}>Annuler</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessageInput;
