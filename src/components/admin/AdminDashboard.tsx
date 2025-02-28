
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListings } from '@/hooks/useListings';
import { useReservations } from '@/hooks/useReservations';
import { useJobs } from '@/hooks/useJobs';
import { useReviews } from '@/hooks/useReviews';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  BarChart, 
  LineChart, 
  PieChart 
} from '@/components/ui/chart';
import { 
  CalendarDays, 
  CircleDollarSign, 
  Home,
  Users, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight,
  Briefcase,
  MessageSquare,
  Calendar,
  TrendingUp,
  Eye
} from 'lucide-react';

export const AdminDashboard = () => {
  const { listings } = useListings();
  const { reservations } = useReservations();
  const { jobs } = useJobs();
  const { reviews } = useReviews();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Fonctions d'analyse de données
  const getTotalRevenue = () => {
    return reservations
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + r.totalPrice, 0);
  };

  const getRecentReservations = () => {
    return [...reservations]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getRecentReviews = () => {
    return [...reviews]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  };

  const getTopListings = () => {
    // Compter les réservations par listing
    const listingCounts = reservations.reduce((counts, reservation) => {
      counts[reservation.listingId] = (counts[reservation.listingId] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    // Trier les listings par nombre de réservations
    return listings
      .map(listing => ({
        ...listing,
        reservationCount: listingCounts[listing.id] || 0
      }))
      .sort((a, b) => b.reservationCount - a.reservationCount)
      .slice(0, 3);
  };

  const getPendingActions = () => {
    const pendingReservations = reservations.filter(r => r.status === 'pending').length;
    const jobApplications = jobs.reduce((sum, job) => 
      sum + (job.applications?.filter(app => app.status === 'pending').length || 0), 0);
    
    return {
      pendingReservations,
      pendingReviews: reviews.filter(r => !r.approved).length,
      pendingApplications: jobApplications
    };
  };

  // Données pour les graphiques
  const revenueData = {
    week: [
      { name: 'Lun', total: 1420 },
      { name: 'Mar', total: 1920 },
      { name: 'Mer', total: 2340 },
      { name: 'Jeu', total: 1800 },
      { name: 'Ven', total: 2900 },
      { name: 'Sam', total: 3100 },
      { name: 'Dim', total: 2500 },
    ],
    month: [
      { name: 'Sem 1', total: 9500 },
      { name: 'Sem 2', total: 12500 },
      { name: 'Sem 3', total: 10300 },
      { name: 'Sem 4', total: 14500 },
    ],
    year: [
      { name: 'Jan', total: 42000 },
      { name: 'Fév', total: 38000 },
      { name: 'Mar', total: 45000 },
      { name: 'Avr', total: 52000 },
      { name: 'Mai', total: 49000 },
      { name: 'Jun', total: 62000 },
      { name: 'Jul', total: 78000 },
      { name: 'Aoû', total: 82000 },
      { name: 'Sep', total: 61000 },
      { name: 'Oct', total: 55000 },
      { name: 'Nov', total: 47000 },
      { name: 'Déc', total: 73000 },
    ]
  };

  const reservationsData = {
    week: [
      { name: 'Lun', total: 3 },
      { name: 'Mar', total: 5 },
      { name: 'Mer', total: 4 },
      { name: 'Jeu', total: 3 },
      { name: 'Ven', total: 7 },
      { name: 'Sam', total: 8 },
      { name: 'Dim', total: 6 },
    ],
    month: [
      { name: 'Sem 1', total: 23 },
      { name: 'Sem 2', total: 31 },
      { name: 'Sem 3', total: 25 },
      { name: 'Sem 4', total: 37 },
    ],
    year: [
      { name: 'Jan', total: 105 },
      { name: 'Fév', total: 95 },
      { name: 'Mar', total: 112 },
      { name: 'Avr', total: 130 },
      { name: 'Mai', total: 122 },
      { name: 'Jun', total: 155 },
      { name: 'Jul', total: 195 },
      { name: 'Aoû', total: 205 },
      { name: 'Sep', total: 152 },
      { name: 'Oct', total: 137 },
      { name: 'Nov', total: 118 },
      { name: 'Déc', total: 183 },
    ]
  };

  const categoryData = [
    { name: "Logements", value: listings.length },
    { name: "Emplois", value: jobs.filter(j => !j.isHousingOffer).length },
    { name: "Offres Logement", value: jobs.filter(j => j.isHousingOffer).length },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStarRating = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const pendingActions = getPendingActions();

  return (
    <div className="space-y-6">
      {/* En-tête du tableau de bord */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        <p className="text-muted-foreground">
          Bienvenue dans l'interface d'administration de votre plateforme.
        </p>
      </div>

      {/* Résumé des statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getTotalRevenue())}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </span>{" "}
              par rapport au mois dernier
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total des logements</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listings.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +4
              </span>{" "}
              nouvelles propriétés ce mois-ci
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservations.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500 inline-flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -2.5%
              </span>{" "}
              par rapport au mois dernier
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Évaluations moyennes</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
                : "N/A"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +0.2
              </span>{" "}
              par rapport au mois dernier
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions en attente */}
      <Card>
        <CardHeader>
          <CardTitle>Actions requises</CardTitle>
          <CardDescription>
            Les éléments nécessitant votre attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/reservations" className="block hover:no-underline">
              <Card className="hover:bg-gray-50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-yellow-100 text-yellow-700 mr-4">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Réservations en attente</div>
                      <div className="font-bold text-xl">{pendingActions.pendingReservations}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/emplois" className="block hover:no-underline">
              <Card className="hover:bg-gray-50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-700 mr-4">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Candidatures en attente</div>
                      <div className="font-bold text-xl">{pendingActions.pendingApplications}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/avis" className="block hover:no-underline">
              <Card className="hover:bg-gray-50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-700 mr-4">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Avis à valider</div>
                      <div className="font-bold text-xl">{pendingActions.pendingReviews}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Graphiques des revenus et réservations */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenus</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={period === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('week')}
                >
                  Semaine
                </Button>
                <Button 
                  variant={period === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('month')}
                >
                  Mois
                </Button>
                <Button 
                  variant={period === 'year' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('year')}
                >
                  Année
                </Button>
              </div>
            </div>
            <CardDescription>
              Les revenus générés par les réservations de logements
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <AreaChart 
              data={revenueData[period]} 
              categories={['total']}
              colors={['#FF385C']} 
              valueFormatter={formatCurrency}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Réservations</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={period === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('week')}
                >
                  Semaine
                </Button>
                <Button 
                  variant={period === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('month')}
                >
                  Mois
                </Button>
                <Button 
                  variant={period === 'year' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setPeriod('year')}
                >
                  Année
                </Button>
              </div>
            </div>
            <CardDescription>
              Nombre de réservations effectuées par période
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <BarChart 
              data={reservationsData[period]} 
              categories={['total']}
              colors={['#FF385C']}
            />
          </CardContent>
        </Card>
      </div>

      {/* Graphiques de répartition */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des annonces</CardTitle>
            <CardDescription>
              Distribution des différents types d'annonces sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChart 
                data={categoryData}
                colors={['#3b82f6', '#10b981', '#f59e0b']}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top des logements</CardTitle>
            <CardDescription>
              Les logements les plus réservés sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getTopListings().map((listing, index) => (
                <div key={listing.id} className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="h-14 w-14 rounded-md overflow-hidden mr-4">
                    <img 
                      src={listing.image || '/placeholder.svg'} 
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{listing.title}</div>
                    <div className="text-xs text-muted-foreground">{listing.location}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-medium">{listing.reservationCount} réservations</div>
                    <div className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Populaire
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dernières activités */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dernières réservations</CardTitle>
            <CardDescription>
              Les réservations les plus récentes sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getRecentReservations().map(reservation => (
                <div key={reservation.id} className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-gray-200 flex items-center justify-center">
                    {reservation.guestName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{reservation.guestName}</div>
                    <div className="text-xs text-muted-foreground truncate">{reservation.listingTitle}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : reservation.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }
                      `}
                    >
                      {reservation.status === 'confirmed' ? 'Confirmée' : 
                       reservation.status === 'pending' ? 'En attente' : 'Annulée'}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">{formatDate(reservation.createdAt)}</div>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/admin/reservations">Voir toutes les réservations</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avis récents</CardTitle>
            <CardDescription>
              Les derniers commentaires laissés par les utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getRecentReviews().map(review => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0 bg-gray-200 flex items-center justify-center">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{review.userName}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(review.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-yellow-500 mr-1 text-sm">{review.rating.toFixed(1)}</div>
                      <div className="text-yellow-500 text-sm">{getStarRating(review.rating)}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    {review.comment.length > 100 
                      ? `${review.comment.substring(0, 100)}...` 
                      : review.comment
                    }
                  </div>
                  <div className="border-t pt-2 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/avis?id=${review.id}`} className="flex items-center text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir détails
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/admin/avis">Voir tous les avis</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
