
import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/components/messages/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface FavoriteMessage extends Message {
  conversationId: string;
  conversationName: string;
  savedAt: Date;
}

export const useFavoriteMessages = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteMessage[]>([]);
  
  // Charger les favoris depuis localStorage au démarrage
  useEffect(() => {
    if (!user) return;
    
    try {
      const savedFavorites = localStorage.getItem(`favorite_messages_${user.id}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites, (key, value) => {
          // Convertir les timestamps en objets Date
          if (key === 'timestamp' || key === 'savedAt') {
            return new Date(value);
          }
          return value;
        }));
      }
    } catch (error) {
      console.error('Failed to load favorite messages', error);
    }
  }, [user]);
  
  // Sauvegarder les favoris dans localStorage à chaque changement
  useEffect(() => {
    if (!user || favorites.length === 0) return;
    
    try {
      localStorage.setItem(`favorite_messages_${user.id}`, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorite messages', error);
    }
  }, [favorites, user]);
  
  const addFavorite = useCallback((message: Message, conversationId: string, conversationName: string) => {
    if (!user) return;
    
    // Vérifier si le message est déjà en favoris
    const isAlreadyFavorite = favorites.some(fav => fav.id === message.id);
    
    if (isAlreadyFavorite) {
      toast.info('Ce message est déjà dans vos favoris');
      return;
    }
    
    const favoriteMessage: FavoriteMessage = {
      ...message,
      conversationId,
      conversationName,
      savedAt: new Date()
    };
    
    setFavorites(prev => [...prev, favoriteMessage]);
    toast.success('Message ajouté aux favoris');
  }, [favorites, user]);
  
  const removeFavorite = useCallback((messageId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== messageId));
    toast.success('Message retiré des favoris');
  }, []);
  
  const isFavorite = useCallback((messageId: string) => {
    return favorites.some(fav => fav.id === messageId);
  }, [favorites]);
  
  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
};
