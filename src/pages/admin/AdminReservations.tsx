
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useJobs } from '@/hooks/useJobs';
import { useReservations } from '@/hooks/reservations';
import ReservationsTable from './reservations/components/ReservationsTable';
import ApplicationsTable from './reservations/components/ApplicationsTable';
import { getFilteredReservations, getFilteredApplications } from './reservations/utils/filterUtils';
import SearchAndFilterBar from './reservations/components/SearchAndFilterBar';
import ReservationDetailsDialog from './reservations/components/ReservationDetailsDialog';
import ApplicationDetailsDialog from './reservations/components/ApplicationDetailsDialog';
import { JobApplication } from '@/types/job';
import { toast } from 'sonner';

const AdminReservations = () => {
  // State hooks
  const [activeTab, setActiveTab] = useState<'reservations' | 'applications'>('reservations');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('');
  const [selectedJobLocation, setSelectedJobLocation] = useState<string>('');
  
  // Data hooks
  const { 
    reservations, 
    isLoading: isLoadingReservations, 
    updateReservationStatus 
  } = useReservations();
  
  const { 
    jobs, 
    isLoading: isLoadingJobs, 
    updateJob 
  } = useJobs();

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'reservations' | 'applications');
    setStatusFilter('all');
    setSearchQuery('');
  };

  // Get filtered data
  const filteredReservations = getFilteredReservations(reservations, statusFilter, searchQuery);
  const filteredApplications = getFilteredApplications(jobs, statusFilter, searchQuery);

  // Handle application selection
  const handleSelectApplication = (application: JobApplication) => {
    setSelectedApplication(application);
    const job = jobs.find(j => j.id === application.jobId);
    if (job) {
      setSelectedJobTitle(job.title);
      setSelectedJobLocation(job.location);
    }
  };

  // Handle reservation status update
  const handleUpdateReservationStatus = (reservationId: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    updateReservationStatus.mutate({ reservationId, status });
  };

  // Update application status
  const handleUpdateApplicationStatus = async (applicationId: string, jobId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const jobToUpdate = jobs.find(job => job.id === jobId);
      
      if (!jobToUpdate) {
        toast.error("Offre d'emploi introuvable");
        return;
      }
      
      if (!jobToUpdate.applications) {
        toast.error("Aucune candidature trouvée pour cette offre");
        return;
      }
      
      const updatedApplications = jobToUpdate.applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      );
      
      const updatedJob = { ...jobToUpdate, applications: updatedApplications };
      
      await updateJob.mutateAsync(updatedJob);
      
      toast.success(`Statut de la candidature mis à jour: ${
        status === 'approved' ? 'Acceptée' :
        status === 'rejected' ? 'Refusée' : 'En attente'
      }`);
      
      // If we're viewing application details, update the selected application
      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication({...selectedApplication, status});
      }
      
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Gérer les réservations et candidatures</h1>
              <p className="text-gray-500">
                Consultez et gérez toutes les réservations et candidatures reçues sur votre plateforme.
              </p>
            </div>

            <Tabs defaultValue="reservations" value={activeTab} onValueChange={handleTabChange}>
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="reservations">Réservations</TabsTrigger>
                  <TabsTrigger value="applications">Candidatures</TabsTrigger>
                </TabsList>
              </div>

              <SearchAndFilterBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                type={activeTab}
              />

              <TabsContent value="reservations" className="mt-4">
                <ReservationsTable 
                  reservations={filteredReservations}
                  isLoading={isLoadingReservations}
                  onSelectReservation={setSelectedReservation}
                  handleUpdateStatus={handleUpdateReservationStatus}
                />
              </TabsContent>

              <TabsContent value="applications" className="mt-4">
                <ApplicationsTable 
                  applications={filteredApplications}
                  isLoading={isLoadingJobs}
                  onSelectApplication={handleSelectApplication}
                  updateApplicationStatus={handleUpdateApplicationStatus}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Dialogs */}
          {selectedReservation && (
            <ReservationDetailsDialog 
              isOpen={!!selectedReservation}
              onOpenChange={() => setSelectedReservation(null)}
              selectedReservation={selectedReservation}
              handleUpdateStatus={handleUpdateReservationStatus}
            />
          )}

          {selectedApplication && (
            <ApplicationDetailsDialog 
              application={selectedApplication}
              jobTitle={selectedJobTitle}
              jobLocation={selectedJobLocation}
              isOpen={!!selectedApplication}
              onClose={() => setSelectedApplication(null)}
              onUpdateStatus={handleUpdateApplicationStatus}
            />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminReservations;
