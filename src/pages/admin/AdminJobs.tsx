
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useJobs } from '@/hooks/useJobs';
import { useListings } from '@/hooks/useListings';
import { JobFormDialog } from '@/components/admin/jobs/JobFormDialog';
import { JobsTable } from '@/components/admin/jobs/JobsTable';
import { Job } from '@/types/job';
import { Listing } from '@/types/listing';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingFormDialog } from '@/components/admin/listings/ListingFormDialog';
import { ListingsTable } from '@/components/admin/listings/ListingsTable';
import { Search, Plus, Filter, RefreshCw, Download, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AdminJobs = () => {
  const { jobs, isLoading: isLoadingJobs, addJob, updateJob, deleteJob } = useJobs();
  const { listings, isLoading: isLoadingListings, addListing, updateListing, deleteListing } = useListings();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [showExpired, setShowExpired] = useState(false);
  const [domainFilter, setDomainFilter] = useState<string>('all');

  // Filtrer les données en fonction de la recherche et autres filtres
  useEffect(() => {
    if (jobs) {
      const filtered = jobs.filter(job => {
        // Filtrer par terme de recherche
        const searchMatch = 
          !searchTerm || 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtrer par statut (actif/expiré)
        const statusMatch = showExpired || job.status === 'active';
        
        // Filtrer par domaine
        const domainMatch = domainFilter === 'all' || job.domain === domainFilter;
        
        return searchMatch && statusMatch && domainMatch;
      });
      
      setFilteredJobs(filtered);
    }
  }, [jobs, searchTerm, showExpired, domainFilter]);

  // Filtrer les listings
  useEffect(() => {
    if (listings) {
      const filtered = listings.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setFilteredListings(filtered);
    }
  }, [listings, searchTerm]);

  const handleSaveJob = async (formData: Omit<Job, "id">) => {
    try {
      await addJob.mutateAsync(formData);
    } catch (error) {
      throw error;
    }
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsEditing(true);
  };

  const handleUpdateJob = async (formData: Omit<Job, "id">) => {
    if (selectedJob) {
      try {
        await updateJob.mutateAsync({ ...formData, id: selectedJob.id });
        setSelectedJob(null);
        setIsEditing(false);
      } catch (error) {
        throw error;
      }
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?")) {
      try {
        await deleteJob.mutateAsync(jobId);
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleSaveListing = async (formData: Omit<Listing, "id">) => {
    try {
      await addListing.mutateAsync(formData);
    } catch (error) {
      throw error;
    }
  };

  const handleEditListing = (listing: Listing) => {
    setSelectedListing(listing);
    setIsEditing(true);
  };

  const handleUpdateListing = async (formData: Omit<Listing, "id">) => {
    if (selectedListing) {
      try {
        await updateListing.mutateAsync({ ...formData, id: selectedListing.id });
        setSelectedListing(null);
        setIsEditing(false);
      } catch (error) {
        throw error;
      }
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce logement ?")) {
      try {
        await deleteListing.mutateAsync(listingId);
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  const exportToCSV = (data: Job[] | Listing[], type: 'jobs' | 'listings') => {
    let csvContent = '';

    if (type === 'jobs') {
      // En-têtes CSV pour les offres d'emploi
      csvContent = 'ID,Titre,Domain,Contrat,Localisation,Salaire,Positions,Date Publication,Date Limite,Statut\n';
      
      // Données
      (data as Job[]).forEach(job => {
        csvContent += `"${job.id}","${job.title}","${job.domain}","${job.contract}","${job.location}","${job.salary.amount}","${job.positions}","${job.publishDate}","${job.deadline}","${job.status}"\n`;
      });
    } else {
      // En-têtes CSV pour les logements
      csvContent = 'ID,Titre,Prix,Localisation,Rating,Dates\n';
      
      // Données
      (data as Listing[]).forEach(listing => {
        csvContent += `"${listing.id}","${listing.title}","${listing.price}","${listing.location}","${listing.rating}","${listing.dates}"\n`;
      });
    }

    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Export des ${type === 'jobs' ? 'offres d\'emploi' : 'logements'} réussi`);
  };

  const getDomainName = (domain: string) => {
    const domains: Record<string, string> = {
      'residential_security': 'Sécurité résidentielle',
      'bodyguard': 'Garde du corps',
      'private_property': 'Propriétés privées',
      'industrial_security': 'Sécurité industrielle',
      'event_security': 'Sécurité événementielle',
      'k9_security': 'Maître-chien',
      'security_trainer': 'Formateur sécurité',
      'housing_offer': 'Offre de logement'
    };
    
    return domains[domain] || domain;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Gestion des offres</h1>
                  <p className="text-gray-500 mt-1">
                    {activeTab === 'jobs' 
                      ? `${filteredJobs.length} offre(s) d'emploi disponible(s)` 
                      : `${filteredListings.length} logement(s) disponible(s)`}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {activeTab === 'jobs' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => exportToCSV(filteredJobs, 'jobs')}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Exporter
                    </Button>
                  )}
                  
                  {activeTab === 'listings' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => exportToCSV(filteredListings, 'listings')}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Exporter
                    </Button>
                  )}
                  
                  {activeTab === 'jobs' && (
                    <JobFormDialog
                      onSave={isEditing ? handleUpdateJob : handleSaveJob}
                      selectedJob={selectedJob}
                      isEditing={isEditing}
                      onCancel={() => {
                        setSelectedJob(null);
                        setIsEditing(false);
                      }}
                    />
                  )}
                  
                  {activeTab === 'listings' && (
                    <ListingFormDialog
                      selectedListing={selectedListing}
                      isEditing={isEditing}
                      onSave={isEditing ? handleUpdateListing : handleSaveListing}
                      onCancel={() => {
                        setSelectedListing(null);
                        setIsEditing(false);
                      }}
                    />
                  )}
                </div>
              </div>

              <Tabs defaultValue="jobs" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
                  <TabsList className="bg-white border">
                    <TabsTrigger value="jobs" className="data-[state=active]:bg-sholom-primary data-[state=active]:text-white">
                      Offres d'emploi
                    </TabsTrigger>
                    <TabsTrigger value="listings" className="data-[state=active]:bg-sholom-primary data-[state=active]:text-white">
                      Offres de logement
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-9 w-[200px] lg:w-[300px]"
                      />
                    </div>
                    
                    {activeTab === 'jobs' && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filtres
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-4">
                            <h4 className="font-medium">Filtres</h4>
                            
                            <div>
                              <h5 className="text-sm font-medium mb-2">Domaine</h5>
                              <div className="flex flex-wrap gap-2">
                                <Badge 
                                  variant={domainFilter === 'all' ? 'default' : 'outline'} 
                                  className="cursor-pointer"
                                  onClick={() => setDomainFilter('all')}
                                >
                                  Tous
                                </Badge>
                                {['residential_security', 'bodyguard', 'event_security', 'k9_security', 'housing_offer'].map(domain => (
                                  <Badge 
                                    key={domain}
                                    variant={domainFilter === domain ? 'default' : 'outline'} 
                                    className="cursor-pointer"
                                    onClick={() => setDomainFilter(domain)}
                                  >
                                    {getDomainName(domain)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="show-expired"
                                checked={showExpired}
                                onChange={() => setShowExpired(!showExpired)}
                                className="mr-2"
                              />
                              <label htmlFor="show-expired" className="text-sm">
                                Afficher les offres expirées
                              </label>
                            </div>
                            
                            <div className="flex justify-between">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setDomainFilter('all');
                                  setShowExpired(false);
                                }}
                                className="gap-2"
                              >
                                <RefreshCw className="h-3 w-3" />
                                Réinitialiser
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => document.body.click()} // Ferme le popover
                                className="bg-sholom-primary hover:bg-sholom-primary/90"
                              >
                                Appliquer
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    
                    {searchTerm && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSearchTerm('')}
                        className="gap-2"
                      >
                        Effacer
                      </Button>
                    )}
                  </div>
                </div>

                <TabsContent value="jobs" className="p-0 border-none">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoadingJobs ? (
                      <div className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
                        </div>
                        <p className="mt-2 text-gray-500">Chargement des offres d'emploi...</p>
                      </div>
                    ) : filteredJobs.length > 0 ? (
                      <JobsTable
                        jobs={filteredJobs}
                        onEdit={handleEditJob}
                        onDelete={handleDeleteJob}
                      />
                    ) : (
                      <div className="p-8 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune offre d'emploi</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Aucune offre d'emploi ne correspond à votre recherche.
                        </p>
                        <div className="mt-6">
                          <JobFormDialog
                            onSave={handleSaveJob}
                            selectedJob={null}
                            isEditing={false}
                            onCancel={() => {}}
                            buttonText="Créer une nouvelle offre"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="listings" className="p-0 border-none">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoadingListings ? (
                      <div className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
                        </div>
                        <p className="mt-2 text-gray-500">Chargement des logements...</p>
                      </div>
                    ) : filteredListings.length > 0 ? (
                      <ListingsTable
                        listings={filteredListings}
                        onEdit={handleEditListing}
                        onDelete={handleDeleteListing}
                      />
                    ) : (
                      <div className="p-8 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun logement</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Aucun logement ne correspond à votre recherche.
                        </p>
                        <div className="mt-6">
                          <Button className="bg-sholom-primary hover:bg-sholom-primary/90 gap-2">
                            <Plus className="h-4 w-4" />
                            Ajouter un logement
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminJobs;
