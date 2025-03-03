
import { useListings } from '@/hooks/useListings';
import { useJobs } from '@/hooks/useJobs';
import { useReservations } from '@/hooks/reservations';
import { useReviews } from '@/hooks/useReviews';

export interface DashboardData {
  // Counts
  listingsCount: number;
  jobsCount: number;
  reservationsCount: number;
  reviewsCount: number;
  
  // Chart data
  revenueData: Array<{
    month: string;
    montant: number;
  }>;
  reservationsStatusData: Array<{
    name: string;
    value: number;
  }>;
  visitorsData: Array<{
    month: string;
    logements: number;
    emplois: number;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    date: string;
    avatar: string;
  }>;
}

export const CHART_COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export const useDashboardData = (): DashboardData => {
  const { listings } = useListings();
  const { jobs } = useJobs();
  const { reservations } = useReservations();
  const { reviews } = useReviews();

  // Demo revenue data
  const revenueData = [
    { month: 'Jan', montant: 12400 },
    { month: 'Fév', montant: 9800 },
    { month: 'Mar', montant: 15700 },
    { month: 'Avr', montant: 18600 },
    { month: 'Mai', montant: 16800 },
    { month: 'Juin', montant: 23100 },
    { month: 'Juil', montant: 25400 },
    { month: 'Août', montant: 28900 },
    { month: 'Sep', montant: 21300 },
    { month: 'Oct', montant: 19700 },
    { month: 'Nov', montant: 24800 },
    { month: 'Déc', montant: 27500 },
  ];

  // Reservations status data
  const reservationsStatusData = [
    { name: 'Confirmées', value: reservations.filter(r => r.status === 'confirmed').length || 8 },
    { name: 'En attente', value: reservations.filter(r => r.status === 'pending').length || 4 },
    { name: 'Annulées', value: reservations.filter(r => r.status === 'cancelled').length || 2 },
  ];

  // Visitors data
  const visitorsData = [
    { month: 'Jan', logements: 320, emplois: 120 },
    { month: 'Fév', logements: 280, emplois: 150 },
    { month: 'Mar', logements: 420, emplois: 210 },
    { month: 'Avr', logements: 390, emplois: 180 },
    { month: 'Mai', logements: 510, emplois: 230 },
    { month: 'Juin', logements: 580, emplois: 250 },
  ];

  // Recent users data
  const recentUsers = [
    { id: '1', name: 'Sophie Martin', email: 'sophie.martin@example.com', date: '2023-09-15', avatar: '/placeholder.svg' },
    { id: '2', name: 'Thomas Dubois', email: 'thomas.dubois@example.com', date: '2023-09-14', avatar: '/placeholder.svg' },
    { id: '3', name: 'Emma Petit', email: 'emma.petit@example.com', date: '2023-09-13', avatar: '/placeholder.svg' },
  ];

  return {
    listingsCount: listings.length,
    jobsCount: jobs.length,
    reservationsCount: reservations.length,
    reviewsCount: reviews.length,
    revenueData,
    reservationsStatusData,
    visitorsData,
    recentUsers
  };
};
