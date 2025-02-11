
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ListingFormDialog } from '@/components/admin/listings/ListingFormDialog';
import { ListingsTable } from '@/components/admin/listings/ListingsTable';
import { Listing } from '@/types/listing';
import { useListings } from '@/hooks/useListings';

const AdminListings = () => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    listings,
    isLoading,
    error,
    addListing,
    updateListing,
    deleteListing
  } = useListings();

  const handleEditListing = (listing: Listing) => {
    setSelectedListing(listing);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = async (formData: Omit<Listing, "id">) => {
    try {
      if (isEditing && selectedListing) {
        await updateListing.mutateAsync({ ...formData, id: selectedListing.id });
      } else {
        await addListing.mutateAsync(formData);
      }
      setIsEditing(false);
      setSelectedListing(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving listing:', error);
    }
  };

  const handleDelete = async (listingId: string) => {
    try {
      await deleteListing.mutateAsync(listingId);
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

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
                  setIsDialogOpen(false);
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
                onDelete={handleDelete}
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
