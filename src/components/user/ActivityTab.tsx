
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, User, Home, Settings, LogIn, ShoppingCart, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const ActivityTab: React.FC = () => {
  // Simuler l'historique d'activité de l'utilisateur
  const activities = [
    {
      id: 1,
      type: 'LOGIN',
      description: 'Connexion depuis Paris, France',
      icon: LogIn,
      date: new Date(2023, 5, 15, 10, 30),
      device: 'iPhone 13 Pro',
    },
    {
      id: 2,
      type: 'RESERVATION',
      description: 'Réservation effectuée pour "Villa de luxe avec piscine"',
      icon: Home,
      date: new Date(2023, 5, 14, 15, 45),
      status: 'confirmée',
    },
    {
      id: 3,
      type: 'PAYMENT',
      description: 'Paiement de 250€ pour la réservation #12345',
      icon: ShoppingCart,
      date: new Date(2023, 5, 14, 15, 50),
      status: 'succès',
    },
    {
      id: 4,
      type: 'PROFILE',
      description: 'Mise à jour de la photo de profil',
      icon: User,
      date: new Date(2023, 5, 12, 9, 15),
    },
    {
      id: 5,
      type: 'SETTINGS',
      description: 'Modification des préférences de notification',
      icon: Settings,
      date: new Date(2023, 5, 10, 14, 20),
    },
  ];

  // Formatter les dates de façon relative (aujourd'hui, hier, etc.)
  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffDays = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Aujourd'hui à ${format(date, 'HH:mm')}`;
    } else if (diffDays === 1) {
      return `Hier à ${format(date, 'HH:mm')}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours à ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM/yyyy à HH:mm');
    }
  };

  // Fonction pour obtenir la couleur du badge en fonction du type d'activité
  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'LOGIN':
        return 'bg-blue-100 text-blue-800';
      case 'RESERVATION':
        return 'bg-green-100 text-green-800';
      case 'PAYMENT':
        return 'bg-purple-100 text-purple-800';
      case 'PROFILE':
        return 'bg-yellow-100 text-yellow-800';
      case 'SETTINGS':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Historique d'activité</CardTitle>
            <CardDescription>Suivez vos actions récentes sur la plateforme</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="rounded-full bg-gray-100 p-2 mt-0.5">
                  <activity.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{activity.description}</div>
                    <Badge variant="outline" className={getActivityBadgeColor(activity.type)}>
                      {activity.type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatRelativeDate(activity.date)}
                    {activity.device && (
                      <span className="ml-3">
                        • {activity.device}
                      </span>
                    )}
                    {activity.status && (
                      <span className="ml-3">
                        • Statut: {activity.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Voir plus d'activité
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
