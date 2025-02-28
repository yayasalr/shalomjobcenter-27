
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Home,
  Briefcase,
  BadgeDollarSign,
  StarIcon,
  UsersRound,
  Building,
  BarChart3,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Calendar,
  LineChart as LineChartIcon
} from "lucide-react";
import { useReviews } from '@/hooks/useReviews';

// Données simulées
const revenueData = [
  { month: 'Jan', amount: 12400 },
  { month: 'Fév', amount: 9800 },
  { month: 'Mar', amount: 15700 },
  { month: 'Avr', amount: 18600 },
  { month: 'Mai', amount: 16800 },
  { month: 'Juin', amount: 23100 },
  { month: 'Juil', amount: 25400 },
  { month: 'Août', amount: 28900 },
  { month: 'Sep', amount: 21300 },
];

const occupancyRateData = [
  { month: 'Jan', rate: 68 },
  { month: 'Fév', rate: 72 },
  { month: 'Mar', rate: 85 },
  { month: 'Avr', rate: 78 },
  { month: 'Mai', rate: 82 },
  { month: 'Juin', rate: 91 },
  { month: 'Juil', rate: 95 },
  { month: 'Août', rate: 98 },
  { month: 'Sep', rate: 87 },
];

const bookingSourcesData = [
  { name: 'Direct', value: 45 },
  { name: 'Airbnb', value: 30 },
  { name: 'Booking', value: 15 },
  { name: 'Autres', value: 10 },
];

const visitorTrafficData = [
  { month: 'Jan', web: 1200, mobile: 800 },
  { month: 'Fév', web: 1100, mobile: 900 },
  { month: 'Mar', web: 1300, mobile: 950 },
  { month: 'Avr', web: 1400, mobile: 1100 },
  { month: 'Mai', web: 1500, mobile: 1300 },
  { month: 'Juin', web: 1700, mobile: 1500 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState("month");
  const { reviews } = useReviews();
  
  // Calcul de statistiques
  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter(review => review.status === "approved").length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) 
    : "N/A";

  const recentReviews = reviews
    .filter(review => review.status === "approved")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-gray-500">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenus</p>
                <h3 className="text-2xl font-bold mt-1">15 670 €</h3>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>8% ce mois</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Réservations</p>
                <h3 className="text-2xl font-bold mt-1">24</h3>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>12% ce mois</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taux d'occupation</p>
                <h3 className="text-2xl font-bold mt-1">87%</h3>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>5% ce mois</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Home className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Évaluation</p>
                <h3 className="text-2xl font-bold mt-1">{averageRating}/5</h3>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <span>{totalReviews} avis</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-yellow-600">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenus</CardTitle>
              <CardDescription>Revenus des réservations par période</CardDescription>
            </div>
            <Tabs value={timeframe} onValueChange={setTimeframe} className="w-[200px]">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="week">Semaine</TabsTrigger>
                <TabsTrigger value="month">Mois</TabsTrigger>
                <TabsTrigger value="year">Année</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} €`, 'Revenus']} />
                  <Area type="monotone" dataKey="amount" stroke="#0891b2" fill="#0e7490" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origine des réservations</CardTitle>
            <CardDescription>Répartition par source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingSourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Taux d'occupation</CardTitle>
            <CardDescription>Pourcentage de jours occupés par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={occupancyRateData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Taux d\'occupation']} />
                  <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Derniers avis</CardTitle>
            <CardDescription>
              Avis récents de vos clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{review.author}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-1">{review.rating}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>Aucun avis pour le moment</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Voir tous les avis
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trafic de visiteurs</CardTitle>
            <CardDescription>Web vs. Mobile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={visitorTrafficData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="web" name="Web" fill="#0ea5e9" />
                  <Bar dataKey="mobile" name="Mobile" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
