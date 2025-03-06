
import { Notification } from './types';

// Initial mock notifications
export const initialNotifications: Notification[] = [
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
];
