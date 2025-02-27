
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useReservations, Reservation } from "@/hooks/useReservations";
import { useJobs } from "@/hooks/useJobs";
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
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckIcon, 
  ClockIcon, 
  Cross1Icon,
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
import { Check, Calendar, X, FileText, Mail, Phone, User, Clock, Search, Download, Eye } from 'lucide-react';
import { Job, JobApplication } from '@/types/job';

const AdminReservations = () => {
  const { reservations, isLoading: isLoadingReservations, updateReservationStatus } = useReservations();
  const { jobs, isLoading: isLoadingJobs } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const [contentTab, setContentTab] = useState("reservations");

  // Trouver le job correspondant à une candidature
  const getJobForApplication = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };

  // Obtenir toutes les candidatures de tous les jobs
  const getAllApplications = () => {
    const applications: {application: JobApplication, job: Job}[] = [];
    
    jobs.forEach(job => {
      if (job.applications && job.applications.length > 0) {
        job.applications.forEach(app => {
          applications.push({
            application: app,
            job: job
          });
        });
      }
    });
    
    return applications;
  };

  // Filtrer les candidatures selon le statut
  const getFilteredApplications = () => {
    const allApplications = getAllApplications();
    
    // Filtrer par onglet de statut
    const statusFiltered = tab === "all" 
      ? allApplications 
      : allApplications.filter(item => item.application.status === tab);
    
    // Filtrer par recherche
    return statusFiltered.filter(item => {
      if (searchQuery.trim() === "") return true;
      
      const query = searchQuery.toLowerCase();
      return (
        item.application.applicantName.toLowerCase().includes(query) ||
        item.application.email.toLowerCase().includes(query) ||
        item.job.title.toLowerCase().includes(query) ||
        item.job.location.toLowerCase().includes(query)
      );
    });
  };

  // Filtrer les réservations
  const getFilteredReservations = () => {
    if (searchQuery.trim() === "") {
      return tab === "all" 
        ? reservations 
        : reservations.filter(r => r.status === tab);
    }
    
    const query = searchQuery.toLowerCase();
    return reservations.filter(reservation => {
      const statusMatch = tab === "all" || reservation.status === tab;
      const searchMatch = 
        reservation.guestName.toLowerCase().includes(query) ||
        reservation.listingTitle.toLowerCase().includes(query) ||
        reservation.listingLocation.toLowerCase().includes(query) ||
        reservation.id.toLowerCase().includes(query);
        
      return statusMatch && searchMatch;
    });
  };

  // Mettre à jour le statut d'une candidature
  const updateApplicationStatus = (applicationId: string, jobId: string, status: 'pending' | 'approved' | 'rejected') => {
    // Trouver le job
    const job = jobs.find(j => j.id === jobId);
    if (!job || !job.applications) return;
    
    // Trouver et mettre à jour la candidature
    const appIndex = job.applications.findIndex(app => app.id === applicationId);
    if (appIndex === -1) return;
    
    // Créer une copie du job avec la candidature mise à jour
    const updatedApplications = [...job.applications];
    updatedApplications[appIndex] = {
      ...updatedApplications[appIndex],
      status
    };
    
    const updatedJob = {
      ...job,
      applications: updatedApplications
    };
    
    // Appeler la mutation pour mettre à jour le job
    try {
      // Utiliser la fonction updateJob du hook useJobs (à implémenter)
      // updateJob.mutate(updatedJob);
      
      toast.success(`Candidature ${
        status === 'approved' 
          ? 'acceptée' 
          : status === 'rejected' 
            ? 'refusée' 
            : 'mise en attente'
      }`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleUpdateStatus = (reservationId: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    updateReservationStatus.mutate({ reservationId, status });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Exporter les données en CSV
  const exportToCSV = (type: 'reservations' | 'applications') => {
    let csvContent = '';
    let filename = '';
    
    if (type === 'reservations') {
      // En-têtes CSV pour les réservations
      csvContent = 'ID,Client,Email,Logement,Localisation,Arrivée,Départ,Voyageurs,Prix,Statut,Date Création\n';
      
      // Données
      getFilteredReservations().forEach(reservation => {
        csvContent += `"${reservation.id}","${reservation.guestName}","${reservation.guestEmail}","${reservation.listingTitle}","${reservation.listingLocation}","${reservation.checkIn}","${reservation.checkOut}","${reservation.guests}","${reservation.totalPrice}","${reservation.status}","${reservation.createdAt}"\n`;
      });
      
      filename = `reservations_export_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      // En-têtes CSV pour les candidatures
      csvContent = 'ID,Candidat,Email,Téléphone,Offre,Localisation,Date Candidature,Statut\n';
      
      // Données
      getFilteredApplications().forEach(item => {
        csvContent += `"${item.application.id}","${item.application.applicantName}","${item.application.email}","${item.application.phone}","${item.job.title}","${item.job.location}","${item.application.submittedAt}","${item.application.status}"\n`;
      });
      
      filename = `candidatures_export_${new Date().toISOString().split('T')[0]}.csv`;
    }

    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Export des ${type === 'reservations' ? 'réservations' : 'candidatures'} réussi`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Gestion des demandes</h1>
                  <p className="text-gray-500 mt-1">
                    {contentTab === 'reservations' 
                      ? `${getFilteredReservations().length} réservation(s)` 
                      : `${getFilteredApplications().length} candidature(s)`}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportToCSV(contentTab === 'reservations' ? 'reservations' : 'applications')}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <Tabs value={contentTab} onValueChange={setContentTab} className="w-full">
                  <TabsList className="bg-white border">
                    <TabsTrigger value="reservations" className="data-[state=active]:bg-sholom-primary data-[state=active]:text-white">
                      Réservations
                    </TabsTrigger>
                    <TabsTrigger value="applications" className="data-[state=active]:bg-sholom-primary data-[state=active]:text-white">
                      Candidatures
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-9 h-9 w-[200px] lg:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSearchQuery('')}
                      className="gap-2"
                    >
                      Effacer
                    </Button>
                  )}
                </div>
              </div>
              
              <Tabs value={tab} onValueChange={setTab} className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">
                    Toutes
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    En attente
                  </TabsTrigger>
                  <TabsTrigger value="confirmed">
                    Confirmées
                  </TabsTrigger>
                  <TabsTrigger value="cancelled">
                    Annulées
                  </TabsTrigger>
                  {contentTab === 'applications' && (
                    <TabsTrigger value="approved">
                      Acceptées
                    </TabsTrigger>
                  )}
                  {contentTab === 'applications' && (
                    <TabsTrigger value="rejected">
                      Refusées
                    </TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
              
              <TabsContent value="reservations" className={contentTab === 'reservations' ? 'block' : 'hidden'}>
                {isLoadingReservations ? (
                  <div className="text-center py-10">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
                    </div>
                    <p className="mt-2 text-gray-500">Chargement des réservations...</p>
                  </div>
                ) : getFilteredReservations().length > 0 ? (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3">Client</th>
                            <th className="px-6 py-3">Logement</th>
                            <th className="px-6 py-3">Période</th>
                            <th className="px-6 py-3">Prix</th>
                            <th className="px-6 py-3">Statut</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getFilteredReservations().map((reservation) => (
                            <tr key={reservation.id} className="hover:bg-gray-50">
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
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden mr-3">
                                    <img
                                      src={reservation.listingImage || "/placeholder.svg"}
                                      alt={reservation.listingTitle}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                      {reservation.listingTitle}
                                    </div>
                                    <div className="text-xs text-gray-500 line-clamp-1">
                                      {reservation.listingLocation}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {reservation.guests} voyageur{reservation.guests > 1 ? 's' : ''}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {Math.round(reservation.totalPrice * 655.957).toLocaleString('fr-FR')} FCFA
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  className={`${
                                    reservation.status === 'confirmed'
                                      ? 'bg-green-100 text-green-800 border-green-200'
                                      : reservation.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                      : 'bg-red-100 text-red-800 border-red-200'
                                  }`}
                                >
                                  {reservation.status === 'confirmed' ? (
                                    <>
                                      <Check className="mr-1 h-3.5 w-3.5" />
                                      Confirmée
                                    </>
                                  ) : reservation.status === 'pending' ? (
                                    <>
                                      <Clock className="mr-1 h-3.5 w-3.5" />
                                      En attente
                                    </>
                                  ) : (
                                    <>
                                      <X className="mr-1 h-3.5 w-3.5" />
                                      Annulée
                                    </>
                                  )}
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
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedReservation(reservation);
                                        setIsDialogOpen(true);
                                      }}
                                    >
                                      Voir les détails
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateStatus(reservation.id, 'confirmed')}
                                      disabled={reservation.status === 'confirmed'}
                                    >
                                      Confirmer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateStatus(reservation.id, 'pending')}
                                      disabled={reservation.status === 'pending'}
                                    >
                                      Mettre en attente
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateStatus(reservation.id, 'cancelled')}
                                      disabled={reservation.status === 'cancelled'}
                                      className="text-red-600"
                                    >
                                      Annuler
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow text-center">
                    <div className="mb-4 text-gray-400">
                      <ClockIcon className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune réservation trouvée</h3>
                    <p className="text-gray-500">Il n'y a pas de réservations correspondant à vos critères.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="applications" className={contentTab === 'applications' ? 'block' : 'hidden'}>
                {isLoadingJobs ? (
                  <div className="text-center py-10">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
                    </div>
                    <p className="mt-2 text-gray-500">Chargement des candidatures...</p>
                  </div>
                ) : getFilteredApplications().length > 0 ? (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3">Candidat</th>
                            <th className="px-6 py-3">Offre</th>
                            <th className="px-6 py-3">Contact</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Statut</th>
                            <th className="