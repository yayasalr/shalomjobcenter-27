
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListings } from '@/hooks/useListings';
import { useJobs } from '@/hooks/useJobs';
import { useReservations } from '@/hooks/useReservations';
import { useReviews } from '@/hooks/useReviews';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ArrowUpRight,
  BadgeDollarSign,
  Building,
  LayoutDashboard,
  UsersRound,
  Home,
  Briefcase,
  Calendar,
  Star,
  ArrowDown,
  ArrowUp,
  CircleUser,
  MoreHorizontal,
} from "lucide-react";

const AdminDashboard = () => {
  const { listings } = useListings();
  const { jobs } = useJobs();
  const { reservations } = useReservations();
  const { reviews } = useReviews();

  // Données pour les graphiques
  const revenueData = [
    { month: 'Jan', montant: 12400 },
    { month: 'Fév', montant: 9800 },
    { month: 'Mar', montant: 15700 },
    { month: 'Avr', montant: 18600 },
    { month: 'Mai', montant: 16800 },
    { month: 'Juin', montant: 23100 },
    { month: 'Juil', montant: 25400 },
    { month: 'Août', montant: 28900 },
    { month: 'Sep', montant: 21300 },
    { month: 'Oct', montant: 19700 },
    { month: 'Nov', montant: 24800 },
    { month: 'Déc', montant: 27500 },
  ];

  const reservationsData = [
    { name: 'Confirmées', value: reservations.filter(r => r.status === 'confirmed').length || 8 },
    { name: 'En attente', value: reservations.filter(r => r.status === 'pending').length || 4 },
    { name: 'Annulées', value: reservations.filter(r => r.status === 'cancelled').length || 2 },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const visitorsData = [
    { month: 'Jan', logements: 320, emplois: 120 },
    { month: 'Fév', logements: 280, emplois: 150 },
    { month: 'Mar', logements: 420, emplois: 210 },
    { month: 'Avr', logements: 390, emplois: 180 },
    { month: 'Mai', logements: 510, emplois: 230 },
    { month: 'Juin', logements: 580, emplois: 250 },
  ];

  const recentUsers = [
    { id: '1', name: 'Sophie Martin', email: 'sophie.martin@example.com', date: '2023-09-15', avatar: '/placeholder.svg' },
    { id: '2', name: 'Thomas Dubois', email: 'thomas.dubois@example.com', date: '2023-09-14', avatar: '/placeholder.svg' },
    { id: '3', name: 'Emma Petit', email: 'emma.petit@example.com', date: '2023-09-13', avatar: '/placeholder.svg' },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Tableau de bord</h1>
            <p className="text-gray-500">Bienvenue sur votre tableau de bord d'administration</p>
          </div>

          {/* Résumé statistique */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Logements</p>
                    <h3 className="text-2xl font-semibold mt-1">{listings.length}</h3>
                    <div className="flex items-center mt-1 text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">4% ce mois</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-blue-50 p-3">
                    <Home className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Offres d'emploi</p>
                    <h3 className="text-2xl font-semibold mt-1">{jobs.length}</h3>
                    <div className="flex items-center mt-1 text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">7% ce mois</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-purple-50 p-3">
                    <Briefcase className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Réservations</p>
                    <h3 className="text-2xl font-semibold mt-1">{reservations.length}</h3>
                    <div className="flex items-center mt-1 text-red-600">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      <span className="text-sm">2% ce mois</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-green-50 p-3">
                    <Calendar className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Avis clients</p>
                    <h3 className="text-2xl font-semibold mt-1">{reviews.length}</h3>
                    <div className="flex items-center mt-1 text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">12% ce mois</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-yellow-50 p-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Graphique des revenus */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenus</CardTitle>
                <CardDescription>
                  Revenus générés par mois (en euros)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} €`, 'Montant']}
                      />
                      <Area type="monotone" dataKey="montant" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Statut des réservations */}
            <Card>
              <CardHeader>
                <CardTitle>Statut des réservations</CardTitle>
                <CardDescription>
                  Répartition des réservations par statut
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reservationsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {reservationsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} réservation(s)`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visiteurs */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Visiteurs</CardTitle>
                <CardDescription>
                  Nombre de visiteurs par type de page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={visitorsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="logements" name="Pages logements" fill="#3B82F6" />
                      <Bar dataKey="emplois" name="Pages emplois" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Utilisateurs récents */}
            <Card>
              <CardHeader>
                <CardTitle>Nouveaux utilisateurs</CardTitle>
                <CardDescription>
                  Derniers utilisateurs inscrits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{user.name}</h4>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(user.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    Voir tous les utilisateurs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
