
import React, { useEffect, useRef, useState } from 'react';
import { Conversation } from '@/components/messages/types';
import MessageBubble from '@/components/messages/MessageBubble';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MessageAreaProps {
  conversation: Conversation;
}

const MessageArea: React.FC<MessageAreaProps> = ({ conversation }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages]);

  // Handle scroll buttons visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Show scroll down button when not at bottom
      setShowScrollDown(scrollTop < scrollHeight - clientHeight - 20);
      // Show scroll up button when not at top
      setShowScrollUp(scrollTop > 20);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 scrollbar-container relative" 
      style={{ backgroundColor: 'var(--whatsapp-chat-background)' }}
    >
      <div className="container mx-auto max-w-4xl">
        {conversation.messages.map((message) => (
          <MessageBubble 
            key={message.id}
            message={message}
            isUser={message.sender === 'admin'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll buttons */}
      {showScrollUp && (
        <Button
          onClick={scrollToTop}
          className="absolute top-4 right-4 rounded-full w-10 h-10 p-0 bg-white shadow-md border border-gray-200"
          variant="outline"
          size="icon"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
      
      {showScrollDown && (
        <Button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 rounded-full w-10 h-10 p-0 bg-white shadow-md border border-gray-200"
          variant="outline"
          size="icon"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default MessageArea;
