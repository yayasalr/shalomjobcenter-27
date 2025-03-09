
import React from 'react';
import { Reservation } from '@/hooks/reservations';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/language';

interface ReservationDetailsProps {
  reservation: Reservation;
}

export const ReservationDetails = ({ reservation }: ReservationDetailsProps) => {
  const { t } = useLanguage();

  // Formater le prix en FCFA
  const priceFCFA = Math.round(reservation.totalPrice * 655.957).toLocaleString('fr-FR');

  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-500">{t('arrival') || 'Arrivée'}:</span>
        </div>
        <span className="font-medium">{new Date(reservation.checkIn).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-500">{t('departure') || 'Départ'}:</span>
        </div>
        <span className="font-medium">{new Date(reservation.checkOut).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-500">{t('travelers') || 'Voyageurs'}:</span>
        </div>
        <span className="font-medium">{reservation.guests}</span>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-500">{t('reserved_on') || 'Réservé le'}:</span>
        </div>
        <span className="font-medium">{new Date(reservation.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between pt-2 border-t">
        <span className="font-semibold">{t('total') || 'Total'}</span>
        <span className="font-bold">{priceFCFA} FCFA</span>
      </div>
    </div>
  );
};
