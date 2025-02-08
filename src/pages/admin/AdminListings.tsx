
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  dates: string;
  host: {
    name: string;
    image: string;
  };
}

const AdminListings = () => {
  const { data: listings = [], isLoading, error } = useQuery<Listing[], Error>({
    queryKey: ['admin-listings'],
    queryFn: async () => {
      // Using the same mock data for now
      return [
        {
          id: "1",
          title: "Superbe villa avec vue",
          location: "Sant Miquel de Balansat, Espagne",
          price: 67,
          rating: 5.0,
          image: "/lovable-uploads/00196f15-e8ff-48fb-bf68-e133fa5e4064.png",
          dates: "15-20 févr.",
          host: {
            name: "Bas",
            image: "/placeholder.svg",
          },
        },
        {
          id: "2",
          title: "Appartement moderne",
          location: "San Miguel, Pérou",
          price: 94,
          rating: 4.94,
          image: "https://a0.muscache.com/im/pictures/miso/Hosting-51809333/original/0da70267-d9da-4efb-9123-2714b651c9fd.jpeg",
          dates: "17-22 févr.",
          host: {
            name: "Enrique",
            image: "/placeholder.svg",
          },
        },
      ];
    },
  });

  if (error) {
    toast.error("Erreur lors du chargement des logements");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <h1 className="text-2xl font-semibold mb-6">Gestion des logements</h1>
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Titre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Localisation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {listings.map((listing) => (
                        <tr key={listing.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{listing.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{listing.price}€</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{listing.rating}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Aucun logement disponible</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminListings;
