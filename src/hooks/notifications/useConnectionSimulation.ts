
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Notification } from './types';

export const useConnectionSimulation = (
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
) => {
  const [isConnected, setIsConnected] = useState(true);
  const { toast: uiToast } = useToast();
  
  // Simuler la réception de nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && isConnected) {
        const newNotification: Notification = {
          id: `new-${Date.now()}`,
          title: 'Nouvelle notification',
          message: 'Vous avez reçu une nouvelle notification en temps réel.',
          type: ['message', 'reservation', 'payment', 'system', 'alert'][Math.floor(Math.random() * 5)] as Notification['type'],
          read: false,
          timestamp: new Date(),
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        // Afficher une notification toast
        uiToast({
          title: newNotification.title,
          description: newNotification.message,
          variant: "default",
        });
      }
    }, 30000); // Toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, [isConnected, uiToast, setNotifications]);
  
  // Simuler une connexion WebSocket
  useEffect(() => {
    setIsConnected(true);
    
    // Simuler des déconnexions occasionnelles
    const connectionCheck = setInterval(() => {
      const randomDisconnect = Math.random() > 0.95;
      if (randomDisconnect) {
        setIsConnected(false);
        uiToast({
          title: "Problème de connexion",
          description: "Tentative de reconnexion...",
          variant: "destructive",
        });
        
        // Simuler une reconnexion après quelques secondes
        setTimeout(() => {
          setIsConnected(true);
          uiToast({
            title: "Connexion rétablie",
            description: "Vous êtes à nouveau connecté aux notifications en temps réel.",
            variant: "default",
          });
        }, 5000);
      }
    }, 60000); // Vérifier chaque minute
    
    return () => clearInterval(connectionCheck);
  }, [uiToast]);

  return { isConnected };
};
