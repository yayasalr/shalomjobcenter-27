import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { useReservations, Reservation } from "@/hooks/reservations";
import { useJobs } from "@/hooks/useJobs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { JobApplication } from '@/types/job';
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

// Import our components
import ReservationsTable from './reservations/components/ReservationsTable';
import ApplicationsTable from './reservations/components/ApplicationsTable';
import ReservationDetailsDialog from './reservations/components/ReservationDetailsDialog';
import ApplicationDetailsDialog from './reservations/components/ApplicationDetailsDialog';
import SearchAndFilterBar from './reservations/components/SearchAndFilterBar';

// Import our utility functions
import { 
  getFilteredReservations, 
  getFilteredApplications 
} from './reservations/utils/filterUtils';
import { exportToCSV } from './reservations/utils/formatUtils';

const AdminReservations = () => {
  const { reservations, isLoading: isLoadingReservations, updateReservationStatus } = useReservations();
  const { jobs, isLoading: isLoadingJobs, updateJob } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const [contentTab, setContentTab] = useState("reservations");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Observer la largeur de l'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      updateJob.mutate(updatedJob);
      
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

  // Functions to handle dialogs
  const handleSelectReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDialogOpen(true);
  };

  const handleSelectApplication = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsApplicationDialogOpen(true);
  };

  // Handle export
  const handleExport = () => {
    if (contentTab === 'reservations') {
      exportToCSV('reservations', getFilteredReservations(reservations, tab, searchQuery));
    } else {
      exportToCSV('applications', getFilteredApplications(jobs, tab, searchQuery));
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
            <div className="mb-6">
              <SearchAndFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                contentTab={contentTab}
                setContentTab={setContentTab}
                tab={tab}
                setTab={setTab}
                onExport={handleExport}
                itemCount={
                  contentTab === 'reservations' 
                    ? getFilteredReservations(reservations, tab, searchQuery).length 
                    : getFilteredApplications(jobs, tab, searchQuery).length
                }
                itemType={contentTab === 'reservations' ? 'réservation' : 'candidature'}
              />
              
              <Tabs value={contentTab} defaultValue="reservations">
                <TabsContent value="reservations" className="mt-4">
                  <ReservationsTable
                    reservations={getFilteredReservations(reservations, tab, searchQuery)}
                    handleUpdateStatus={handleUpdateStatus}
                    onSelectReservation={handleSelectReservation}
                    isLoading={isLoadingReservations}
                  />
                </TabsContent>
                
                <TabsContent value="applications" className="mt-4">
                  <ApplicationsTable
                    applications={getFilteredApplications(jobs, tab, searchQuery)}
                    updateApplicationStatus={updateApplicationStatus}
                    onSelectApplication={handleSelectApplication}
                    isLoading={isLoadingJobs}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>

        {/* Modals for details */}
        <ReservationDetailsDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedReservation={selectedReservation}
          handleUpdateStatus={handleUpdateStatus}
        />
        
        <ApplicationDetailsDialog
          isOpen={isApplicationDialogOpen}
          onOpenChange={setIsApplicationDialogOpen}
          selectedApplication={selectedApplication}
          jobs={jobs}
          updateApplicationStatus={updateApplicationStatus}
        />
      </div>
    </SidebarProvider>
  );
};

export default AdminReservations;
