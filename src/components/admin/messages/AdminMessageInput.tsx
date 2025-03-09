
import React, { useRef, useEffect } from 'react';
import { Conversation } from '@/components/messages/types';
import { Button } from '@/components/ui/button';
import { Smile, Paperclip, Mic, Send } from 'lucide-react';
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
  const inputRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) {
        handleSendMessage();
      }
    }
  };

  // Fix cursor position and focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      // Focus the input
      inputRef.current.focus();
      
      // Place cursor at the end
      const range = document.createRange();
      const sel = window.getSelection();
      if (inputRef.current.lastChild) {
        range.setStartAfter(inputRef.current.lastChild);
      } else {
        range.setStart(inputRef.current, 0);
      }
      range.collapse(true);
      
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // Update message content
    setNewMessage(e.currentTarget.textContent || '');
  };

  return (
    <div className="p-3 bg-gray-100 border-t">
      {quickResponses.length > 0 && (
        <QuickResponseSelector 
          responses={quickResponses}
          onSelect={onQuickResponseSelect}
          onAdd={onAddQuickResponse}
          onRemove={onRemoveQuickResponse}
        />
      )}
      
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500"
        >
          <Smile className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 mr-1"
        >
          <Paperclip className="h-6 w-6" />
        </Button>
        
        <div 
          ref={inputRef}
          className="flex-1 min-h-[40px] bg-white rounded-md px-3 py-2 focus:outline-none"
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder="Écrivez un message..."
          suppressContentEditableWarning={true}
          style={{
            padding: '10px 12px', 
            borderRadius: '20px'
          }}
        >{newMessage}</div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 ml-1"
          disabled={Boolean(newMessage.trim())}
        >
          <Mic className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`ml-1 ${newMessage.trim() ? 'text-blue-500' : 'text-gray-500'}`}
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isSending}
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>

      {isPreviewMode && (
        <div className="mt-3 p-3 bg-white rounded-md border">
          <div className="bg-gray-50 p-3 rounded mb-2">
            <h4 className="font-medium mb-1">Aperçu du message</h4>
            <p>{newMessage}</p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={cancelPreview}
            >
              Annuler
            </Button>
            
            <Button 
              size="sm"
              onClick={sendFromPreview}
              disabled={isSending}
            >
              Envoyer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessageInput;
