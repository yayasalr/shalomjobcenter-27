
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReservationsTabContent } from '@/components/reservations/ReservationsTabContent';
import { useReservationsPage } from '@/components/reservations/useReservationsPage';
import { Calendar, Download, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarView } from '@/components/reservations/CalendarView';
import { AIRecommendations } from '@/components/reservations/AIRecommendations';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

const UserReservations = () => {
  const {
    isLoading,
    upcoming,
    past,
    cancelled,
    handleViewDetails,
    handleCancelReservation
  } = useReservationsPage();
  
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const isMobile = useIsMobile();

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des réservations...</div>;
  }
  
  const handleExportCalendar = (format: 'ical' | 'google') => {
    toast.success(`Réservations exportées au format ${format === 'ical' ? 'iCal' : 'Google Calendar'}`);
  };
  
  const handleModificationRequest = (reservationId: string) => {
    toast.success(`Demande de modification pour la réservation ${reservationId} envoyée`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mt-4 md:mt-8">Mes réservations</h1>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <span className="hidden md:inline mr-2">Liste</span>
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('calendar')}
            >
              <span className="hidden md:inline mr-2">Calendrier</span>
              <Calendar className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportCalendar('ical')}
            >
              <span className="hidden md:inline mr-2">Exporter</span>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {view === 'list' ? (
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-8">
              <TabsTrigger value="upcoming">À venir ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Passées ({past.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées ({cancelled.length})</TabsTrigger>
              <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <ReservationsTabContent 
                value="upcoming"
                reservations={upcoming}
                emptyTitle="Aucune réservation à venir"
                emptyDescription="Vous n'avez pas de réservations prévues pour le moment."
                onViewDetails={handleViewDetails}
                onCancel={handleCancelReservation}
                onModify={handleModificationRequest}
                showModifyButton={true}
              />
            </TabsContent>
            
            <TabsContent value="past">
              <ReservationsTabContent 
                value="past"
                reservations={past}
                emptyTitle="Aucune réservation passée"
                emptyDescription="Vous n'avez pas encore effectué de réservation."
                onViewDetails={handleViewDetails}
                showReviewButton={true}
              />
            </TabsContent>
            
            <TabsContent value="cancelled">
              <ReservationsTabContent 
                value="cancelled"
                reservations={cancelled}
                emptyTitle="Aucune réservation annulée"
                emptyDescription="Vous n'avez pas de réservations annulées."
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
            
            <TabsContent value="recommendations">
              <AIRecommendations 
                userReservations={[...past, ...upcoming]} 
              />
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des réservations</CardTitle>
              <CardDescription>Visualisez toutes vos réservations sur un calendrier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2 mb-4">
                <Button variant="outline" size="sm" onClick={() => handleExportCalendar('google')}>
                  Exporter vers Google
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportCalendar('ical')}>
                  Exporter au format iCal
                </Button>
              </div>
              <CalendarView 
                reservations={[...upcoming, ...past, ...cancelled]} 
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserReservations;
