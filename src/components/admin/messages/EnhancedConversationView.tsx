
import React from 'react';
import { Conversation } from '@/components/messages/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AdminMessageInput from './AdminMessageInput';
import { OnlineStatusIndicator } from './OnlineStatusIndicator';

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
  if (!conversation) {
    return (
      <div className="col-span-2 flex flex-col h-full justify-center items-center border rounded-r-lg bg-gray-50">
        <div className="text-center p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Sélectionnez une conversation</h3>
          <p className="text-gray-500">
            Choisissez une conversation dans la liste pour commencer à échanger des messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-2 flex flex-col h-full border rounded-r-lg">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={conversation.with.avatar} />
            <AvatarFallback>
              {conversation.with.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{conversation.with.name}</h3>
              <div className="ml-2">
                <OnlineStatusIndicator isOnline={isOnline} />
              </div>
            </div>
            <div className="flex gap-2 text-sm text-gray-500">
              {conversation.with.email && (
                <span>{conversation.with.email}</span>
              )}
              {conversation.with.role && (
                <Badge variant="outline" className="text-xs">
                  {conversation.with.role}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              En ligne
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              Hors ligne
            </Badge>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender !== 'admin' && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarImage src={conversation.with.avatar} />
                  <AvatarFallback>
                    {conversation.with.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'admin' 
                    ? 'bg-blue-100 text-blue-800 rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'admin' 
                    ? 'text-blue-700' 
                    : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  {!message.read && message.sender !== 'admin' && (
                    <span className="ml-2 font-medium">• Non lu</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
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
