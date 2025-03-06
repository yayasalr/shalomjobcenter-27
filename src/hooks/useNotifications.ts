
import { useState } from 'react';
import { Notification } from '@/components/notifications/types';

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
    },
    {
      id: '3',
      title: 'Paiement reçu',
      message: 'Le paiement de 650€ pour votre séjour a été effectué avec succès.',
      type: 'payment',
      read: true,
      timestamp: new Date(Date.now() - 172800000), // 2 jours
    },
    {
      id: '4',
      title: 'Rappel',
      message: 'Votre séjour à "Villa avec piscine à Kégué" commence dans 3 jours.',
      type: 'system',
      read: true,
      timestamp: new Date(Date.now() - 259200000), // 3 jours
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
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true,
      }))
    );
  };

  return {
    notifications,
    unreadCount,
    markAllAsRead,
  };
};
