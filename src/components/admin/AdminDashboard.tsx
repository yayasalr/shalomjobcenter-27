
import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <h1 className="text-2xl font-semibold mb-6">Tableau de bord</h1>
            
            {/* Conteneur des statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Logements */}
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/logements')}>
                <h3 className="text-sm font-medium text-gray-500">Logements actifs</h3>
                <p className="text-3xl font-semibold mt-2">124</p>
                <span className="text-sm text-green-500">+12% ce mois</span>
              </Card>

              {/* Réservations */}
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/reservations')}>
                <h3 className="text-sm font-medium text-gray-500">Réservations en cours</h3>
                <p className="text-3xl font-semibold mt-2">89</p>
                <span className="text-sm text-green-500">+5% ce mois</span>
              </Card>

              {/* Revenus */}
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/paiements')}>
                <h3 className="text-sm font-medium text-gray-500">Revenus du mois</h3>
                <p className="text-3xl font-semibold mt-2">45,239€</p>
                <span className="text-sm text-green-500">+8% ce mois</span>
              </Card>

              {/* Taux d'occupation */}
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/statistiques')}>
                <h3 className="text-sm font-medium text-gray-500">Taux d'occupation</h3>
                <p className="text-3xl font-semibold mt-2">78%</p>
                <span className="text-sm text-red-500">-2% ce mois</span>
              </Card>
            </div>

            {/* Section des dernières actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Dernières actions</h2>
              <div className="space-y-4">
                {/* Action items */}
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Nouveau logement ajouté</p>
                    <p className="text-sm text-gray-500">Villa avec piscine à Nice</p>
                  </div>
                  <span className="text-sm text-gray-500">Il y a 2 heures</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Nouvelle réservation</p>
                    <p className="text-sm text-gray-500">Appartement Paris 16ème</p>
                  </div>
                  <span className="text-sm text-gray-500">Il y a 3 heures</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Nouvel avis</p>
                    <p className="text-sm text-gray-500">Chalet à Chamonix</p>
                  </div>
                  <span className="text-sm text-gray-500">Il y a 5 heures</span>
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                variant="outline"
                onClick={() => navigate('/admin/activites')}
              >
                Voir toutes les activités
              </Button>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
