
import React from 'react';
import { Bell, CheckCircle, MessageSquare, Calendar } from 'lucide-react';

interface EmptyNotificationStateProps {
  type: 'all' | 'unread' | 'messages' | 'reservations';
}

const EmptyNotificationState = ({ type }: EmptyNotificationStateProps) => {
  const getContent = () => {
    switch (type) {
      case 'unread':
        return {
          icon: <CheckCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />,
          title: 'Tout est à jour',
          message: 'Vous avez lu toutes vos notifications.'
        };
      case 'messages':
        return {
          icon: <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />,
          title: 'Pas de messages',
          message: 'Vous n\'avez aucune notification de message.'
        };
      case 'reservations':
        return {
          icon: <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />,
          title: 'Pas de réservations',
          message: 'Vous n\'avez aucune notification de réservation.'
        };
      case 'all':
      default:
        return {
          icon: <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />,
          title: 'Pas de notifications',
          message: 'Vous n\'avez aucune notification pour le moment.'
        };
    }
  };

  const content = getContent();

  return (
    <div className="text-center py-12">
      {content.icon}
      <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
      <p className="text-gray-500">
        {content.message}
      </p>
    </div>
  );
};

export default EmptyNotificationState;
