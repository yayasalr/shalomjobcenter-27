
import React, { useState } from 'react';
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

const AdminJobs = () => {
  const { jobs, isLoading: isLoadingJobs, addJob, updateJob, deleteJob } = useJobs();
  const { listings, isLoading: isLoadingListings, addListing, updateListing, deleteListing } = useListings();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtrer les données en fonction de la recherche
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Gestion des offres</h1>
              
              <div className="flex gap-4">
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

            <div className="mb-6">
              <Tabs defaultValue="jobs" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="jobs">Offres d'emploi</TabsTrigger>
                  <TabsTrigger value="listings">Offres de logement</TabsTrigger>
                </TabsList>

                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Rechercher par titre ou localisation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                <TabsContent value="jobs">
                  {isLoadingJobs ? (
                    <div className="grid grid-cols-1 gap-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <JobsTable
                      jobs={filteredJobs}
                      onEdit={handleEditJob}
                      onDelete={handleDeleteJob}
                    />
                  )}
                </TabsContent>

                <TabsContent value="listings">
                  {isLoadingListings ? (
                    <div className="grid grid-cols-1 gap-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ListingsTable
                      listings={filteredListings}
                      onEdit={handleEditListing}
                      onDelete={handleDeleteListing}
                    />
                  )}
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
