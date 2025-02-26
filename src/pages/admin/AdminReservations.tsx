
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useReservations, Reservation } from "@/hooks/useReservations";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CaretSortIcon, 
  CheckCircledIcon, 
  ClockIcon, 
  Cross2Icon, 
  DotsHorizontalIcon, 
  ReloadIcon, 
  MagnifyingGlassIcon 
} from "@radix-ui/react-icons";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminReservations = () => {
  const { reservations, isLoading, updateReservationStatus } = useReservations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tab, setTab] = useState("all");

  const handleUpdateStatus = (reservationId: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    updateReservationStatus.mutate({ reservationId, status });
  };

  const filteredReservations = reservations
    .filter(reservation => {
      // Filtrage par onglet
      if (tab !== "all") {
        return reservation.status === tab;
      }
      return true;
    })
    .filter(reservation => {
      // Filtrage par recherche
      if (searchQuery.trim() === "") return true;
      
      const query = searchQuery.toLowerCase();
      return (
        reservation.guestName.toLowerCase().includes(query) ||
        reservation.listingTitle.toLowerCase().includes(query) ||
        reservation.listingLocation.toLowerCase().includes(query) ||
        reservation.id.toLowerCase().includes(query)
      );
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Gestion des réservations</h1>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher une réservation..."
                    className="pl-10 w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setTab("all");
                  }}
                >
                  <ReloadIcon className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
              </div>
            </div>
            
            <Tabs value={tab} onValueChange={setTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">
                  Toutes ({reservations.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  En attente ({reservations.filter(r => r.status === 'pending').length})
                </TabsTrigger>
                <TabsTrigger value="confirmed">
                  Confirmées ({reservations.filter(r => r.status === 'confirmed').length})
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Annulées ({reservations.filter(r => r.status === 'cancelled').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredReservations.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Logement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredReservations.map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                                <img
                                  src={reservation.listingImage || "/placeholder.svg"}
                                  alt={reservation.listingTitle}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {reservation.listingTitle}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {reservation.listingLocation}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{reservation.guestName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{reservation.guestName}</div>
                                <div className="text-sm text-gray-500">{reservation.guestEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reservation.guests} voyageur{reservation.guests > 1 ? 's' : ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {Math.round(reservation.totalPrice * 655.957).toLocaleString('fr-FR')} FCFA
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={`${
                                reservation.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : reservation.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {reservation.status === 'confirmed' ? (
                                <CheckCircledIcon className="mr-1 h-3.5 w-3.5" />
                              ) : reservation.status === 'pending' ? (
                                <ClockIcon className="mr-1 h-3.5 w-3.5" />
                              ) : (
                                <Cross2Icon className="mr-1 h-3.5 w-3.5" />
                              )}
                              {reservation.status === 'confirmed'
                                ? 'Confirmée'
                                : reservation.status === 'pending'
                                ? 'En attente'
                                : 'Annulée'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <DotsHorizontalIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <Dropdown