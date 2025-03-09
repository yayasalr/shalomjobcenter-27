
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Smile, Paperclip, Mic, Send, MoreVertical } from 'lucide-react';
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
  const inputRef = useRef<HTMLDivElement>(null);
  const [selectionPosition, setSelectionPosition] = useState<number | null>(null);

  // Cette fonction gère l'envoi du message
  const sendMessage = () => {
    if (!newMessage.trim() || isSending) return;
    handleSendMessage();
  };

  // Effet pour maintenir le contenu et le curseur à la bonne position
  useEffect(() => {
    if (inputRef.current) {
      // S'assurer que le contenu reflète toujours newMessage
      if (inputRef.current.textContent !== newMessage) {
        // Mettre à jour le contenu
        inputRef.current.textContent = newMessage;
        
        // Restaurer la position du curseur seulement si on vient de taper du texte
        if (selectionPosition !== null) {
          const newRange = document.createRange();
          const selection = window.getSelection();
          
          try {
            if (inputRef.current.firstChild) {
              newRange.setStart(inputRef.current.firstChild, 
                              Math.min(selectionPosition, newMessage.length));
              newRange.collapse(true);
              
              selection?.removeAllRanges();
              selection?.addRange(newRange);
            } else if (newMessage === '') {
              // Le nœud est vide, placer simplement le curseur au début
              newRange.setStart(inputRef.current, 0);
              newRange.collapse(true);
              
              selection?.removeAllRanges();
              selection?.addRange(newRange);
            }
          } catch (e) {
            console.error("Erreur lors du positionnement du curseur:", e);
          }
          
          // Réinitialiser pour éviter de repositionner lors d'autres rendus
          setSelectionPosition(null);
        }
      }
    }
  }, [newMessage, selectionPosition]);

  // Fonction pour gérer les changements de texte manuellement
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    
    // Enregistrer la position actuelle du curseur
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const position = selection.getRangeAt(0).startOffset;
      setSelectionPosition(position);
    }
    
    setNewMessage(text);
  };

  return (
    <>
      <div className="flex items-center p-2 bg-[#f0f2f5]">
        <div className="flex items-center gap-2 w-full bg-white rounded-3xl px-4 py-2">
          <QuickResponses
            responses={quickResponses}
            onSelectResponse={onQuickResponseSelect}
            onAddResponse={onAddQuickResponse}
            onRemoveResponse={onRemoveQuickResponse}
          />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-[#8696a0] hover:bg-transparent"
          >
            <Smile className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-[#8696a0] hover:bg-transparent"
          >
            <Paperclip className="h-6 w-6" />
          </Button>
          
          <div 
            ref={inputRef}
            contentEditable 
            className="flex-1 outline-none min-h-[24px] max-h-[100px] overflow-y-auto px-2 break-words"
            onInput={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            data-placeholder="Saisissez votre message..."
            suppressContentEditableWarning={true}
          ></div>
          
          <Button 
            onClick={sendMessage} 
            disabled={isSending || !newMessage.trim()}
            className="rounded-full bg-transparent hover:bg-transparent p-0 text-[#8696a0]"
            size="icon"
          >
            {newMessage.trim() ? <Send className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>
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
