
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import {
  DashboardHeader,
  StatCards,
  RevenueChart,
  ReservationsPieChart,
  VisitorsBarChart,
  RecentUsers
} from '@/components/admin/dashboard';
import { useDashboardData, CHART_COLORS } from '@/hooks/admin/useDashboardData';

const AdminDashboard = () => {
  const dashboardData = useDashboardData();

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <DashboardHeader 
            title="Tableau de bord" 
            subtitle="Bienvenue sur votre tableau de bord d'administration" 
          />

          {/* Résumé statistique */}
          <StatCards 
            listingsCount={dashboardData.listingsCount}
            jobsCount={dashboardData.jobsCount}
            reservationsCount={dashboardData.reservationsCount}
            reviewsCount={dashboardData.reviewsCount}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Graphique des revenus */}
            <RevenueChart data={dashboardData.revenueData} />

            {/* Statut des réservations */}
            <ReservationsPieChart 
              data={dashboardData.reservationsStatusData} 
              colors={CHART_COLORS} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visiteurs */}
            <VisitorsBarChart data={dashboardData.visitorsData} />

            {/* Utilisateurs récents */}
            <RecentUsers users={dashboardData.recentUsers} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
