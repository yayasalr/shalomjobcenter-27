
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Reservation {
  id: string;
  listingId: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const AdminReservations = () => {
  const { data: reservations = [], isLoading, error } = useQuery<Reservation[], Error>({
    queryKey: ['admin-reservations'],
    queryFn: async () => {
      // Using mock data for now
      return [
        {
          id: "1",
          listingId: "1",
          checkIn: "2024-02-15",
          checkOut: "2024-02-20",
          guestName: "John Doe",
          totalPrice: 335,
          status: "confirmed"
        },
        {
          id: "2",
          listingId: "2",
          checkIn: "2024-02-17",
          checkOut: "2024-02-22",
          guestName: "Jane Smith",
          totalPrice: 470,
          status: "pending"
        },
      ];
    },
  });

  if (error) {
    toast.error("Erreur lors du chargement des réservations");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <h1 className="text-2xl font-semibold mb-6">Gestion des réservations</h1>
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : reservations && reservations.length > 0 ? (
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{reservation.guestName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{reservation.totalPrice}€</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {reservation.status === 'confirmed' ? 'Confirmé' :
                               reservation.status === 'pending' ? 'En attente' : 'Annulé'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Aucune réservation disponible</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminReservations;
