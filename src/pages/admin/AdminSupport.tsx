
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  user: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  lastUpdate: string;
}

const AdminSupport = () => {
  const { data: tickets = [], isLoading, error } = useQuery<Ticket[], Error>({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      // Using mock data for now
      return [
        {
          id: "1",
          subject: "Problème de réservation",
          user: "John Doe",
          priority: "high",
          status: "open",
          createdAt: "2024-02-15",
          lastUpdate: "2024-02-15",
        },
        {
          id: "2",
          subject: "Question sur le paiement",
          user: "Jane Smith",
          priority: "medium",
          status: "in_progress",
          createdAt: "2024-02-14",
          lastUpdate: "2024-02-16",
        },
      ];
    },
  });

  if (error) {
    toast.error("Erreur lors du chargement des tickets");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <h1 className="text-2xl font-semibold mb-6">Support & Assistance</h1>
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : tickets && tickets.length > 0 ? (
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priorité
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dernière mise à jour
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                              <div className="text-sm text-gray-500">{ticket.user}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${ticket.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {ticket.priority === 'high' ? 'Haute' :
                               ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${ticket.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                                ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {ticket.status === 'open' ? 'Ouvert' :
                               ticket.status === 'in_progress' ? 'En cours' : 'Résolu'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(ticket.lastUpdate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="default"
                              size="sm"
                              className="inline-flex items-center"
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Répondre
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Aucun ticket disponible</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminSupport;
