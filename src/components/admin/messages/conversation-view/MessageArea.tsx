
import React, { useEffect, useRef, useState } from 'react';
import { Message } from '@/components/messages/types';
import { MessageBubble } from './MessageBubble';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageAreaProps {
  messages: Message[];
  senderAvatar: string;
  senderName: string;
}

export const MessageArea: React.FC<MessageAreaProps> = ({
  messages,
  senderAvatar,
  senderName
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  
  // Fonction pour gérer le scroll
  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
    
    setIsAtBottom(isBottom);
    setShowScrollButtons(scrollHeight > clientHeight * 1.5);
  };
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);
  
  // Set up initial scroll position
  useEffect(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      }
      handleScroll();
    }, 100);
  }, []);

  return (
    <div className="whatsapp-message-area relative flex-1 overflow-hidden">
      <div 
        className="h-full overflow-y-auto px-4 py-2 scrollbar-container" 
        onScroll={handleScroll}
        ref={scrollAreaRef}
      >
        <div className="space-y-2">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id}
              message={message}
              senderAvatar={senderAvatar}
              senderName={senderName}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {showScrollButtons && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          {!isAtBottom && (
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full shadow-md" 
              onClick={scrollToBottom}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          )}
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full shadow-md" 
            onClick={scrollToTop}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
