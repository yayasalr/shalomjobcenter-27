
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
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getFilteredApplications().map((item) => (
                            <tr key={item.application.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarFallback>{item.application.applicantName[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{item.application.applicantName}</div>
                                    <div className="text-sm text-gray-500">{item.application.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.job.title}</div>
                                  <div className="text-xs text-gray-500 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {item.job.location}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Phone className="h-4 w-4 mr-1 text-gray-400" />
                                  {item.application.phone}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(item.application.submittedAt)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  className={`${
                                    item.application.status === 'approved'
                                      ? 'bg-green-100 text-green-800 border-green-200'
                                      : item.application.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                      : 'bg-red-100 text-red-800 border-red-200'
                                  }`}
                                >
                                  {item.application.status === 'approved' ? (
                                    <>
                                      <Check className="mr-1 h-3.5 w-3.5" />
                                      Acceptée
                                    </>
                                  ) : item.application.status === 'pending' ? (
                                    <>
                                      <Clock className="mr-1 h-3.5 w-3.5" />
                                      En attente
                                    </>
                                  ) : (
                                    <>
                                      <X className="mr-1 h-3.5 w-3.5" />
                                      Refusée
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
                                        setSelectedApplication(item.application);
                                        setIsApplicationDialogOpen(true);
                                      }}
                                    >
                                      Voir les détails
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => updateApplicationStatus(item.application.id, item.job.id, 'approved')}
                                      disabled={item.application.status === 'approved'}
                                    >
                                      Accepter
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => updateApplicationStatus(item.application.id, item.job.id, 'pending')}
                                      disabled={item.application.status === 'pending'}
                                    >
                                      Mettre en attente
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => updateApplicationStatus(item.application.id, item.job.id, 'rejected')}
                                      disabled={item.application.status === 'rejected'}
                                      className="text-red-600"
                                    >
                                      Refuser
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
                      <FileText className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune candidature trouvée</h3>
                    <p className="text-gray-500">Il n'y a pas de candidatures correspondant à vos critères.</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </main>
        </div>
      </div>

      {/* Modal de détails de réservation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedReservation && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de la réservation</DialogTitle>
                <DialogDescription>
                  Réservation #{selectedReservation.id.substring(0, 8)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Logement</h3>
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden mr-3">
                        <img
                          src={selectedReservation.listingImage || "/placeholder.svg"}
                          alt={selectedReservation.listingTitle}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{selectedReservation.listingTitle}</div>
                        <div className="text-gray-500">{selectedReservation.listingLocation}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Client</h3>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>{selectedReservation.guestName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">{selectedReservation.guestName}</div>
                        <div className="text-gray-500">{selectedReservation.guestEmail}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Période de séjour</h3>
                    <div className="text-sm">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Arrivée: {formatDate(selectedReservation.checkIn)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Départ: {formatDate(selectedReservation.checkOut)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Détails</h3>
                    <div className="text-sm">
                      <div className="flex items-center mb-1">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedReservation.guests} voyageur{selectedReservation.guests > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Réservé le {formatDate(selectedReservation.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Statut et paiement</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="text-sm">
                      <Badge
                        className={`${
                          selectedReservation.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : selectedReservation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {selectedReservation.status === 'confirmed' ? (
                          <>
                            <Check className="mr-1 h-3.5 w-3.5" />
                            Confirmée
                          </>
                        ) : selectedReservation.status === 'pending' ? (
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
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-medium">
                        Prix: {Math.round(selectedReservation.totalPrice * 655.957).toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedReservation.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Notes</h3>
                      <div className="text-sm bg-gray-50 p-3 rounded-md">{selectedReservation.notes}</div>
                    </div>
                  </>
                )}
              </div>
              
              <DialogFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Fermer
                  </Button>
                  
                  <div className="space-x-2">
                    {selectedReservation.status !== 'confirmed' && (
                      <Button
                        onClick={() => {
                          handleUpdateStatus(selectedReservation.id, 'confirmed');
                          setIsDialogOpen(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Confirmer
                      </Button>
                    )}
                    
                    {selectedReservation.status !== 'cancelled' && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleUpdateStatus(selectedReservation.id, 'cancelled');
                          setIsDialogOpen(false);
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </Button>
                    )}
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de détails de candidature */}
      <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de la candidature</DialogTitle>
                <DialogDescription>
                  Candidature #{selectedApplication.id.substring(0, 8)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Offre</h3>
                    <div className="text-sm">
                      {getJobForApplication(selectedApplication.jobId) && (
                        <>
                          <div className="font-medium">{getJobForApplication(selectedApplication.jobId)?.title}</div>
                          <div className="text-gray-500">{getJobForApplication(selectedApplication.jobId)?.location}</div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Candidat</h3>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>{selectedApplication.applicantName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">{selectedApplication.applicantName}</div>
                        <div className="text-gray-500">{selectedApplication.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Contact</h3>
                    <div className="text-sm">
                      <div className="flex items-center mb-1">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedApplication.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedApplication.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Détails</h3>
                    <div className="text-sm">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Candidature envoyée le {formatDate(selectedApplication.submittedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Badge
                          className={`${
                            selectedApplication.status === 'approved'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : selectedApplication.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {selectedApplication.status === 'approved' ? (
                            <>
                              <Check className="mr-1 h-3.5 w-3.5" />
                              Acceptée
                            </>
                          ) : selectedApplication.status === 'pending' ? (
                            <>
                              <Clock className="mr-1 h-3.5 w-3.5" />
                              En attente
                            </>
                          ) : (
                            <>
                              <X className="mr-1 h-3.5 w-3.5" />
                              Refusée
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedApplication.resume && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium mb-1">CV</h3>
                      <div className="text-sm">
                        <Link 
                          to={selectedApplication.resume} 
                          target="_blank" 
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Voir le CV
                        </Link>
                      </div>
                    </div>
                  </>
                )}
                
                {selectedApplication.coverLetter && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Lettre de motivation</h3>
                      <div className="text-sm bg-gray-50 p-3 rounded-md">{selectedApplication.coverLetter}</div>
                    </div>
                  </>
                )}
              </div>
              
              <DialogFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={() => setIsApplicationDialogOpen(false)}
                  >
                    Fermer
                  </Button>
                  
                  <div className="space-x-2">
                    {selectedApplication.status !== 'approved' && getJobForApplication(selectedApplication.jobId) && (
                      <Button
                        onClick={() => {
                          updateApplicationStatus(selectedApplication.id, selectedApplication.jobId, 'approved');
                          setIsApplicationDialogOpen(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accepter
                      </Button>
                    )}
                    
                    {selectedApplication.status !== 'rejected' && getJobForApplication(selectedApplication.jobId) && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          updateApplicationStatus(selectedApplication.id, selectedApplication.jobId, 'rejected');
                          setIsApplicationDialogOpen(false);
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Refuser
                      </Button>
                    )}
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminReservations;
