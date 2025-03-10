
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from './types';
import { Send, ArrowLeft, Paperclip, Image, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface EnhancedConversationViewProps {
  conversation: Conversation;
  conversations: Conversation[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isOnline: boolean;
  onBack?: () => void;
  updateConversationWithMessage: (conversationId: string, message: any) => void;
}

const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({
  conversation,
  conversations,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isOnline,
  onBack,
  updateConversationWithMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  useEffect(() => {
    if (isOnline && Math.random() > 0.7) {
      const typingTimeout = setTimeout(() => {
        setIsTyping(true);
        
        // Simuler la fin de la frappe et l'envoi d'un message après un délai
        const messageTimeout = setTimeout(() => {
          setIsTyping(false);
          
          // Seulement pour l'admin, simuler une réponse automatique
          if (conversation.with.id === 'admin') {
            const autoResponses = [
              "Comment puis-je vous aider aujourd'hui ?",
              "Avez-vous d'autres questions ?",
              "N'hésitez pas à me contacter si vous avez besoin de quoi que ce soit.",
              "Je suis là pour vous aider avec vos questions.",
              "Merci pour votre message. Y a-t-il autre chose que je puisse faire pour vous ?"
            ];
            
            const newMessage: Message = {
              id: `msg-${uuidv4()}`,
              content: autoResponses[Math.floor(Math.random() * autoResponses.length)],
              timestamp: new Date(),
              read: false,
              sender: 'admin',
            };
            
            updateConversationWithMessage(conversation.id, newMessage);
          }
        }, 2000);
        
        return () => clearTimeout(messageTimeout);
      }, 1000);
      
      return () => clearTimeout(typingTimeout);
    }
  }, [conversation.messages, isOnline, conversation.with.id, conversation.id, updateConversationWithMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-3 border-b">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={conversation.with.avatar || '/placeholder.svg'} />
          <AvatarFallback>{conversation.with.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{conversation.with.name}</h3>
          <p className="text-xs text-gray-500">
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "mb-4 max-w-[80%]",
              message.sender === 'user' ? "ml-auto" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "p-3 rounded-lg",
                message.sender === 'user'
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white border rounded-bl-none"
              )}
            >
              {message.content}
            </div>
            <div
              className={cn(
                "text-xs mt-1",
                message.sender === 'user' ? "text-right" : "text-left"
              )}
            >
              {formatTime(message.timestamp)}
              {message.sender === 'user' && message.read && (
                <span className="ml-1 text-gray-500">✓</span>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="mb-4 max-w-[80%] mr-auto">
            <div className="bg-white border p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-3 border-t flex items-center">
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <Image className="h-5 w-5 text-gray-500" />
        </Button>
        <div
          contentEditable
          className="flex-1 min-h-[40px] max-h-[120px] overflow-y-auto bg-gray-100 rounded-md px-3 py-2 mx-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onInput={(e) => setNewMessage(e.currentTarget.textContent || '')}
          onKeyDown={handleKeyPress}
          dangerouslySetInnerHTML={{ __html: newMessage }}
          data-placeholder="Écrivez un message..."
        ></div>
        <Button
          variant="ghost"
          size="icon"
          className="mr-1"
        >
          <Smile className="h-5 w-5 text-gray-500" />
        </Button>
        <Button
          size="icon"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full h-10 w-10 flex items-center justify-center"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedConversationView;
