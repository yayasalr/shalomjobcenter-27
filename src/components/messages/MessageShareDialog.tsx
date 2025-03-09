
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Conversation, Message } from './types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share, CheckCircle2, Send } from 'lucide-react';

interface MessageShareDialogProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  selectedConversations: string[];
  onToggleConversation: (conversationId: string) => void;
  onShare: () => void;
}

const MessageShareDialog: React.FC<MessageShareDialogProps> = ({
  message,
  isOpen,
  onClose,
  conversations,
  selectedConversations,
  onToggleConversation,
  onShare
}) => {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share className="h-5 w-5 mr-2" />
            Partager le message
          </DialogTitle>
          <DialogDescription>
            Choisissez les conversations auxquelles transférer ce message
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 border rounded-md mb-4 bg-gray-50">
          <p className="text-sm">{message.content}</p>
        </div>
        
        <ScrollArea className="h-60 w-full pr-4">
          <div className="space-y-2">
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => onToggleConversation(conv.id)}
              >
                <Checkbox 
                  checked={selectedConversations.includes(conv.id)}
                  onCheckedChange={() => onToggleConversation(conv.id)}
                  id={`conv-${conv.id}`}
                />
                <div className="flex-1 truncate">
                  <label 
                    htmlFor={`conv-${conv.id}`}
                    className="cursor-pointer font-medium truncate"
                  >
                    {conv.with.name}
                  </label>
                </div>
                {selectedConversations.includes(conv.id) && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="text-sm text-gray-500">
            {selectedConversations.length} conversation(s) sélectionnée(s)
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={onShare} 
              disabled={selectedConversations.length === 0}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Partager
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageShareDialog;
