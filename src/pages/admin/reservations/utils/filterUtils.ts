
import { Reservation } from "@/hooks/reservations"; 
import { Job, JobApplication } from '@/types/job';

// Filtrer les réservations
export const getFilteredReservations = (reservations: Reservation[], tab: string, searchQuery: string) => {
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

// Trouver le job correspondant à une candidature
export const getJobForApplication = (jobs: Job[], jobId: string) => {
  return jobs.find(job => job.id === jobId);
};

// Obtenir toutes les candidatures de tous les jobs
export const getAllApplications = (jobs: Job[]) => {
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
export const getFilteredApplications = (
  jobs: Job[], 
  tab: string, 
  searchQuery: string
) => {
  const allApplications = getAllApplications(jobs);
  
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
