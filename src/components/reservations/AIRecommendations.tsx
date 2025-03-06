
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Reservation } from '@/hooks/reservations';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Clock, Calendar, Info, Star, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIRecommendationsProps {
  userReservations: Reservation[];
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ userReservations }) => {
  // Ces recommandations seraient générées par une IA en fonction des réservations passées
  // Pour la démo, nous utilisons des données statiques
  const recommendations = [
    {
      id: 1,
      title: "Villa avec vue sur la mer",
      location: "Cannes, France",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      price: 180,
      rating: 4.8,
      tags: ["Plage", "Luxe", "Vue mer"],
      reason: "Basé sur votre séjour à Nice"
    },
    {
      id: 2,
      title: "Appartement au cœur de Lomé",
      location: "Lomé, Togo",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      price: 85,
      rating: 4.5,
      tags: ["Centre-ville", "Moderne", "Sécurisé"],
      reason: "Destination populaire que vous n'avez pas encore visitée"
    },
    {
      id: 3,
      title: "Chalet en montagne",
      location: "Chamonix, France",
      image: "https://images.unsplash.com/photo-1575652471646-d37dd7331d45?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3",
      price: 150,
      rating: 4.9,
      tags: ["Montagne", "Ski", "Nature"],
      reason: "Destination populaire en hiver"
    },
  ];
  
  // Événements à proximité des lieux précédemment visités
  const events = [
    {
      id: 1,
      title: "Festival de Jazz",
      location: "Nice, France",
      date: "15-20 juin 2024",
      type: "Culture"
    },
    {
      id: 2,
      title: "Marathon international",
      location: "Lomé, Togo",
      date: "5 septembre 2024",
      type: "Sport"
    },
    {
      id: 3,
      title: "Exposition d'art contemporain",
      location: "Paris, France",
      date: "10-15 juillet 2024",
      type: "Art"
    },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Recommandations personnalisées</CardTitle>
          <CardDescription>
            Des suggestions basées sur vos réservations précédentes et vos préférences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={recommendation.image} 
                    alt={recommendation.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{recommendation.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {recommendation.location}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-medium">€{recommendation.price} /nuit</div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      {recommendation.rating}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {recommendation.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500 flex items-start">
                    <Info className="h-3 w-3 mr-1 mt-0.5" />
                    <span>{recommendation.reason}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="default" className="w-full">
                    Voir le logement
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Événements à ne pas manquer</CardTitle>
          <CardDescription>
            Des événements proches des destinations que vous avez déjà visitées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-start space-x-4 p-3 border rounded-md">
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {event.date}
                  </div>
                </div>
                <Badge>{event.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommandations d'hébergeurs</CardTitle>
          <CardDescription>
            Des hôtes avec lesquels vous avez déjà séjourné proposent de nouvelles offres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Home className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">Marie Dupont</div>
                  <div className="text-sm text-gray-500">Hôte à Nice</div>
                </div>
              </div>
              <p className="text-sm mb-3">
                "Merci pour votre séjour! J'ai une nouvelle propriété disponible avec -15% pour les clients fidèles."
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Voir l'offre
              </Button>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Home className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">Jean Martin</div>
                  <div className="text-sm text-gray-500">Hôte à Paris</div>
                </div>
              </div>
              <p className="text-sm mb-3">
                "Nouvelle disponibilité dans mon appartement du 15ème pour les dates de votre prochain voyage à Paris."
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Voir l'offre
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
