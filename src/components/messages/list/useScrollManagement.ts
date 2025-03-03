
import { useState, useRef, useEffect } from 'react';
import { Conversation } from '../types';

export const useScrollManagement = (conversation: Conversation) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Automatic scrolling to the last message
  useEffect(() => {
    if (messagesEndRef.current && isAtBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages, isAtBottom]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isScrollable = target.scrollHeight > target.clientHeight;
    
    setShowScrollButtons(isScrollable);
    
    // Check if we're at the bottom
    const isBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 10;
    setIsAtBottom(isBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsAtBottom(true);
  };

  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  };

  return {
    scrollAreaRef,
    messagesEndRef,
    showScrollButtons,
    isAtBottom,
    handleScroll,
    scrollToBottom,
    scrollToTop
  };
};
