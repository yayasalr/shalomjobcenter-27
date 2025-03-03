
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Eye, Paperclip, Smile, Mic } from 'lucide-react';
import { QuickResponses } from './QuickResponses';
import { MessagePreview } from './MessagePreview';
import { Conversation } from '@/components/messages/types';

interface AdminMessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  conversation: Conversation | null;
  isSending: boolean;
  quickResponses: string[];
  onQuickResponseSelect: (text: string) => void;
  onAddQuickResponse: (text: string) => void;
  onRemoveQuickResponse: (index: number) => void;
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
  isPreviewMode,
  previewMessage,
  sendFromPreview,
  cancelPreview
}) => {
  const sendMessage = () => {
    if (!newMessage.trim() || isSending) return;
    handleSendMessage();
  };

  return (
    <>
      <div className="whatsapp-input-area">
        <QuickResponses
          responses={quickResponses}
          onSelectResponse={onQuickResponseSelect}
          onAddResponse={onAddQuickResponse}
          onRemoveResponse={onRemoveQuickResponse}
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 hover:bg-gray-200 rounded-full"
        >
          <Smile className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 hover:bg-gray-200 rounded-full"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <div 
          contentEditable 
          className="whatsapp-input" 
          dir="ltr" // Force left-to-right text direction
          onInput={(e) => setNewMessage(e.currentTarget.textContent || '')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isPreviewMode) {
                previewMessage();
              }
            }
          }}
          suppressContentEditableWarning={true}
        >
          {newMessage}
        </div>
        
        <Button
          variant="outline"
          onClick={previewMessage}
          disabled={isSending || !newMessage.trim()}
          className="rounded-full mr-1"
          size="icon"
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        <Button 
          onClick={sendMessage} 
          disabled={isSending || !newMessage.trim()}
          className="whatsapp-send-button"
          size="icon"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            newMessage.trim() ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Modal de prévisualisation du message */}
      <MessagePreview
        isOpen={isPreviewMode}
        onClose={cancelPreview}
        onSend={sendFromPreview}
        message={newMessage}
        recipient={conversation?.with.name || 'Utilisateur'}
      />
    </>
  );
};

export default AdminMessageInput;
