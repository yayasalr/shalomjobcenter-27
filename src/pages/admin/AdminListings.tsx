
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListingFormDialog } from '@/components/admin/listings/ListingFormDialog';
import { ListingsTable } from '@/components/admin/listings/ListingsTable';
import { Listing } from '@/types/listing';

const AdminListings = () => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: listings = [], isLoading, error } = useQuery<Listing[], Error>({
    queryKey: ['admin-listings'],
    queryFn: async () => {
      return [
        {
          id: "1",
          title: "Superbe villa avec vue",
          location: "Sant Miquel de Balansat, Espagne",
          price: 67,
          rating: 5.0,
          image: "/lovable-uploads/00196f15-e8ff-48fb-bf68-e133fa5e4064.png",
          dates: "15-20 févr.",
          description: "Une magnifique villa avec vue sur la mer...",
          images: ["/lovable-uploads/00196f15-e8ff-48fb-bf68-e133fa5e4064.png"],
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
          description: "Un appartement moderne au cœur de la ville...",
          images: ["https://a0.muscache.com/im/pictures/miso/Hosting-51809333/original/0da70267-d9da-4efb-9123-2714b651c9fd.jpeg"],
          host: {
            name: "Enrique",
            image: "/placeholder.svg",
          },
        },
      ];
    },
  });

  const handleEditListing = (listing: Listing) => {
    setSelectedListing(listing);
    setIsEditing(true);
  };

  const handleSave = () => {
    toast.success("Modifications enregistrées");
    setIsEditing(false);
    setSelectedListing(null);
  };

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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Gestion des logements</h1>
              <ListingFormDialog
                selectedListing={selectedListing}
                isEditing={isEditing}
                onSave={handleSave}
                onCancel={() => {
                  setIsEditing(false);
                  setSelectedListing(null);
                }}
              />
            </div>
            
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
              <ListingsTable
                listings={listings}
                onEdit={handleEditListing}
              />
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
