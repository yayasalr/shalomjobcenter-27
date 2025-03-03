
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Eye } from 'lucide-react';
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
      <div className="p-4 border-t">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Textarea
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isPreviewMode) {
                    previewMessage();
                  }
                }
              }}
              className="min-h-[80px] resize-none"
              disabled={isSending}
            />
            <div className="flex justify-between mt-2">
              <QuickResponses
                responses={quickResponses}
                onSelectResponse={onQuickResponseSelect}
                onAddResponse={onAddQuickResponse}
                onRemoveResponse={onRemoveQuickResponse}
              />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={previewMessage}
                  disabled={isSending || !newMessage.trim()}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                
                <Button
                  onClick={sendMessage}
                  disabled={isSending || !newMessage.trim()}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Envoyer
                </Button>
              </div>
            </div>
          </div>
        </div>
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
