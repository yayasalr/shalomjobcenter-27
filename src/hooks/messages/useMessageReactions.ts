
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type Reaction = {
  emoji: string;
  userId: string;
  userName: string;
  timestamp: Date;
};

export type MessageReactions = Record<string, Reaction[]>;

export const useMessageReactions = () => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<MessageReactions>({});
  
  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!user) return;
    
    setReactions(prev => {
      const messageReactions = prev[messageId] || [];
      
      // Vérifier si l'utilisateur a déjà ajouté cette réaction
      const existingReactionIndex = messageReactions.findIndex(
        r => r.userId === user.id && r.emoji === emoji
      );
      
      if (existingReactionIndex >= 0) {
        // Si la réaction existe déjà, la supprimer (toggle)
        const updatedReactions = [...messageReactions];
        updatedReactions.splice(existingReactionIndex, 1);
        
        return {
          ...prev,
          [messageId]: updatedReactions
        };
      }
      
      // Ajouter la nouvelle réaction
      const newReaction: Reaction = {
        emoji,
        userId: user.id,
        userName: user.name || 'User',
        timestamp: new Date()
      };
      
      return {
        ...prev,
        [messageId]: [...messageReactions, newReaction]
      };
    });
    
    // Persister dans localStorage
    saveReactionsToStorage();
  }, [user]);

  const removeReaction = useCallback((messageId: string, index: number) => {
    setReactions(prev => {
      const messageReactions = prev[messageId] || [];
      if (index < 0 || index >= messageReactions.length) return prev;
      
      const updatedReactions = [...messageReactions];
      updatedReactions.splice(index, 1);
      
      return {
        ...prev,
        [messageId]: updatedReactions
      };
    });
    
    // Persister dans localStorage
    saveReactionsToStorage();
  }, []);

  const saveReactionsToStorage = useCallback(() => {
    if (!user) return;
    
    try {
      localStorage.setItem(`message_reactions_${user.id}`, JSON.stringify(reactions));
    } catch (error) {
      console.error('Failed to save message reactions to localStorage', error);
    }
  }, [reactions, user]);

  const loadReactionsFromStorage = useCallback(() => {
    if (!user) return;
    
    try {
      const savedReactions = localStorage.getItem(`message_reactions_${user.id}`);
      if (savedReactions) {
        setReactions(JSON.parse(savedReactions));
      }
    } catch (error) {
      console.error('Failed to load message reactions from localStorage', error);
    }
  }, [user]);

  return {
    reactions,
    addReaction,
    removeReaction,
    loadReactionsFromStorage
  };
};
