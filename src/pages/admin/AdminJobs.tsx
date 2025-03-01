
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useJobs } from '@/hooks/useJobs';
import { useListings } from '@/hooks/useListings';
import { JobFormDialog } from '@/components/admin/jobs/JobFormDialog';
import { Job } from '@/types/job';
import { Listing } from '@/types/listing';
import { TabsContainer } from '@/components/admin/jobs/TabsContainer';
import { ListingFormDialog } from '@/components/admin/listings/ListingFormDialog';
import { ExportButton } from '@/components/admin/shared/ExportButton';
import { AddItemButton } from '@/components/admin/shared/AddItemButton';

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
                    <ExportButton data={filteredJobs} type="jobs" />
                  )}
                  
                  {activeTab === 'listings' && (
                    <ExportButton data={filteredListings} type="listings" />
                  )}
                  
                  {activeTab === 'jobs' && (
                    <AddItemButton
                      onClick={() => {
                        setSelectedJob(null);
                        setIsEditing(false);
                      }}
                      label="Ajouter une offre"
                    />
                  )}
                  
                  {activeTab === 'listings' && (
                    <AddItemButton
                      onClick={() => {
                        setSelectedListing(null);
                        setIsEditing(false);
                      }}
                      label="Ajouter un logement"
                    />
                  )}
                </div>
              </div>

              <TabsContainer
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showExpired={showExpired}
                setShowExpired={setShowExpired}
                domainFilter={domainFilter}
                setDomainFilter={setDomainFilter}
                getDomainName={getDomainName}
                isLoadingJobs={isLoadingJobs}
                isLoadingListings={isLoadingListings}
                filteredJobs={filteredJobs}
                filteredListings={filteredListings}
                handleEditJob={handleEditJob}
                handleDeleteJob={handleDeleteJob}
                handleEditListing={handleEditListing}
                handleDeleteListing={handleDeleteListing}
                onCreateJob={() => {
                  setSelectedJob(null);
                  setIsEditing(false);
                }}
                onCreateListing={() => {
                  setSelectedListing(null);
                  setIsEditing(false);
                }}
              />
            </div>

            {/* Formulaires de dialogue */}
            <JobFormDialog
              onSave={isEditing ? handleUpdateJob : handleSaveJob}
              selectedJob={selectedJob}
              isEditing={isEditing}
              onCancel={() => {
                setSelectedJob(null);
                setIsEditing(false);
              }}
            />
            
            <ListingFormDialog
              selectedListing={selectedListing}
              isEditing={isEditing}
              onSave={isEditing ? handleUpdateListing : handleSaveListing}
              onCancel={() => {
                setSelectedListing(null);
                setIsEditing(false);
              }}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminJobs;
