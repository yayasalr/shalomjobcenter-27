
import { useState, useEffect } from 'react';
import { Notification, NotificationGroup } from '@/components/notifications/types';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

export const useNotifications = () => {
  // Notifications simulées
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nouveau message',
      message: 'Sophie Martin vous a envoyé un message concernant votre réservation.',
      type: 'message',
      read: false,
      timestamp: new Date(Date.now() - 3600000), // 1 heure
      actionUrl: '/messages',
      actionLabel: 'Voir le message',
      important: true,
      sender: {
        id: 'user1',
        name: 'Sophie Martin',
        avatar: '/placeholder.svg'
      }
    },
    {
      id: '2',
      title: 'Réservation confirmée',
      message: 'Votre réservation pour "Appartement spacieux au cœur de Lomé" a été confirmée.',
      type: 'reservation',
      read: false,
      timestamp: new Date(Date.now() - 86400000), // 1 jour
      actionUrl: '/reservations',
      actionLabel: 'Voir ma réservation',
      category: 'confirmation'
    },
    {
      id: '3',
      title: 'Paiement reçu',
      message: 'Le paiement de 650€ pour votre séjour a été effectué avec succès.',
      type: 'payment',
      read: true,
      timestamp: new Date(Date.now() - 172800000), // 2 jours
      saved: true
    },
    {
      id: '4',
      title: 'Rappel',
      message: 'Votre séjour à "Villa avec piscine à Kégué" commence dans 3 jours.',
      type: 'system',
      read: true,
      timestamp: new Date(Date.now() - 259200000), // 3 jours
      important: true
    },
    {
      id: '5',
      title: 'Alerte de sécurité',
      message: 'Une connexion inhabituelle a été détectée sur votre compte. Vérifiez vos paramètres de sécurité.',
      type: 'alert',
      read: true,
      timestamp: new Date(Date.now() - 604800000), // 7 jours
      actionUrl: '/profile?tab=security',
      actionLabel: 'Vérifier maintenant',
    },
  ]);
  
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const { toast: uiToast } = useToast();
  
  // Filtrer les notifications selon le type sélectionné
  const filteredNotifications = filterType 
    ? notifications.filter(n => n.type === filterType)
    : notifications;
  
  // Grouper les notifications par date (aujourd'hui, hier, cette semaine, plus ancien)
  const groupedNotifications = () => {
    const groups: NotificationGroup[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    // Aujourd'hui
    const todayNotifications = filteredNotifications.filter(n => {
      const date = new Date(n.timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });
    
    if (todayNotifications.length > 0) {
      groups.push({
        date: today,
        notifications: todayNotifications,
      });
    }
    
    // Hier
    const yesterdayNotifications = filteredNotifications.filter(n => {
      const date = new Date(n.timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === yesterday.getTime();
    });
    
    if (yesterdayNotifications.length > 0) {
      groups.push({
        date: yesterday,
        notifications: yesterdayNotifications,
      });
    }
    
    // Cette semaine
    const thisWeekNotifications = filteredNotifications.filter(n => {
      const date = new Date(n.timestamp);
      date.setHours(0, 0, 0, 0);
      return date > lastWeek && date < yesterday;
    });
    
    if (thisWeekNotifications.length > 0) {
      groups.push({
        date: lastWeek,
        notifications: thisWeekNotifications,
      });
    }
    
    // Plus ancien
    const olderNotifications = filteredNotifications.filter(n => {
      const date = new Date(n.timestamp);
      date.setHours(0, 0, 0, 0);
      return date < lastWeek;
    });
    
    if (olderNotifications.length > 0) {
      groups.push({
        date: new Date(0), // Date d'epoch pour "Plus ancien"
        notifications: olderNotifications,
      });
    }
    
    return groups;
  };
  
  // Nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true,
      }))
    );
    
    if (unreadCount > 0) {
      toast.success(`${unreadCount} notification${unreadCount > 1 ? 's' : ''} marquée${unreadCount > 1 ? 's' : ''} comme lue${unreadCount > 1 ? 's' : ''}`);
    }
  };
  
  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  // Marquer une notification comme non lue
  const markAsUnread = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: false }
          : notification
      )
    );
  };
  
  // Sauvegarder une notification
  const saveNotification = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, saved: true }
          : notification
      )
    );
  };
  
  // Retirer une notification des favoris
  const unsaveNotification = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, saved: false }
          : notification
      )
    );
  };
  
  // Supprimer une notification
  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
  };
  
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
  }, [isConnected, uiToast]);
  
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

  return {
    notifications: filteredNotifications,
    groupedNotifications: groupedNotifications(),
    unreadCount,
    isConnected,
    filterType,
    setFilterType,
    markAllAsRead,
    markAsRead,
    markAsUnread,
    saveNotification,
    unsaveNotification,
    deleteNotification
  };
};
