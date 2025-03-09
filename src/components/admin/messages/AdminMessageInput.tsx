
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
      
      <div className="flex">
        <div
          className="flex-1 min-h-[40px] max-h-[120px] overflow-y-auto p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          contentEditable
          onInput={(e) => setNewMessage(e.currentTarget.textContent || '')}
          onKeyDown={handleKeyDown}
          dangerouslySetInnerHTML={{__html: newMessage}}
        />
        
        <Button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isSending}
          className="rounded-l-none"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* For future implementation: message preview UI could be added here */}
    </div>
  );
};

export default AdminMessageInput;
