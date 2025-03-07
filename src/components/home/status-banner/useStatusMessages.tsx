
import { useState, useEffect, useCallback } from 'react';

export const useStatusMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Fonction pour charger les messages du stockage local
  const loadMessages = useCallback(() => {
    try {
      const storedMessages = localStorage.getItem('admin-status-messages');
      const parsedMessages = storedMessages ? JSON.parse(storedMessages) : [];
      
      // Filtrer pour n'avoir que les messages actifs
      const activeMessages = parsedMessages.filter((msg: any) => msg.isActive || msg.active);
      
      console.info("Données chargées pour admin-status-messages:", activeMessages);
      
      setMessages(activeMessages);
      setIsVisible(activeMessages.length > 0 && !isDismissed);
      
      if (activeMessages.length > 0 && currentIndex >= activeMessages.length) {
        setCurrentIndex(0);
      }
      
      setHasLoaded(true);
    } catch (error) {
      console.error("Erreur lors du chargement des messages de statut:", error);
      setMessages([]);
      setIsVisible(false);
      setHasLoaded(true);
    }
  }, [currentIndex, isDismissed]);

  // Charger les messages au montage du composant
  useEffect(() => {
    loadMessages();
    
    // Ajouter un écouteur d'événement pour les mises à jour du stockage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-status-messages') {
        loadMessages();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadMessages]);

  // Fonction pour passer au message suivant
  const nextMessage = useCallback(() => {
    if (messages.length > 1) {
      setCurrentIndex(prev => (prev + 1) % messages.length);
    }
  }, [messages.length]);

  // Fonction pour masquer la bannière
  const dismissBanner = useCallback(() => {
    setIsDismissed(true);
    setIsVisible(false);
  }, []);

  return {
    currentMessage: messages[currentIndex],
    hasMessages: messages.length > 0,
    isVisible,
    hasLoaded,
    isDismissed,
    setIsDismissed,
    messages,
    currentIndex,
    nextMessage,
    dismissBanner
  };
};
