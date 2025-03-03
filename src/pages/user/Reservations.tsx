import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useReservations, Reservation } from '@/hooks/reservations';
import { Calendar, MapPin, Users, Clock, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';

const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
  const getBadgeVariant = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Inconnu';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={reservation.listingImage}
          alt={reservation.listingTitle}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{reservation.listingTitle}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {reservation.listingLocation}
            </CardDescription>
          </div>
          <Badge variant={getBadgeVariant(reservation.status) as any}>
            {getStatusText(reservation.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-500">Arrivée:</span>
            </div>
            <span className="font-medium">{new Date(reservation.checkIn).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-500">Départ:</span>
            </div>
            <span className="font-medium">{new Date(reservation.checkOut).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-500">Voyageurs:</span>
            </div>
            <span className="font-medium">{reservation.guests}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-500">Réservé le:</span>
            </div>
            <span className="font-medium">{new Date(reservation.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-semibold">Total</span>
            <span className="font-bold">{reservation.totalPrice.toLocaleString()} €</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="w-full">Détails</Button>
        {reservation.status === 'pending' && (
          <Button variant="destructive" className="w-full">Annuler</Button>
        )}
      </CardFooter>
    </Card>
  );
};

const UserReservations = () => {
  const { reservations, isLoading } = useReservations();
  
  const upcoming = reservations.filter(r => 
    r.status !== 'cancelled' && new Date(r.checkIn) >= new Date()
  );
  
  const past = reservations.filter(r => 
    new Date(r.checkOut) < new Date()
  );
  
  const cancelled = reservations.filter(r => 
    r.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 mt-8">Mes réservations</h1>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-8">
            <TabsTrigger value="upcoming">À venir ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Passées ({past.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Annulées ({cancelled.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 border border-dashed rounded-lg">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune réservation à venir</h3>
                <p className="text-gray-500 mb-6">
                  Vous n'avez pas de réservations prévues pour le moment.
                </p>
                <Button asChild>
                  <a href="/">Découvrir des logements</a>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {past.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 border border-dashed rounded-lg">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune réservation passée</h3>
                <p className="text-gray-500 mb-6">
                  Vous n'avez pas encore effectué de réservation.
                </p>
                <Button asChild>
                  <a href="/">Découvrir des logements</a>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cancelled">
            {cancelled.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelled.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 border border-dashed rounded-lg">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune réservation annulée</h3>
                <p className="text-gray-500 mb-6">
                  Vous n'avez pas de réservations annulées.
                </p>
                <Button asChild>
                  <a href="/">Découvrir des logements</a>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserReservations;
