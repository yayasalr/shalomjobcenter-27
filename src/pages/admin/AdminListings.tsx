
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Image as ImageIcon, Edit, Trash } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  dates: string;
  description?: string;
  images?: string[];
  host: {
    name: string;
    image: string;
  };
}

const AdminListings = () => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newImages, setNewImages] = useState<FileList | null>(null);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (files.length > 10) {
        toast.error("Vous ne pouvez pas télécharger plus de 10 images");
        return;
      }
      setNewImages(files);
    }
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un logement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[725px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau logement</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title">Titre</label>
                      <Input id="title" placeholder="Titre du logement" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="description">Description</label>
                      <Textarea 
                        id="description" 
                        placeholder="Description détaillée..."
                        className="min-h-[200px]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="images">Images (max 10)</label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="flex-1"
                        />
                        <Button variant="outline" className="gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Ajouter des images
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label>Prix par nuit</label>
                      <Input type="number" placeholder="Prix en €" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave}>
                      Enregistrer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditListing(listing)}
                                className="gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Modifier
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="gap-2"
                              >
                                <Trash className="h-4 w-4" />
                                Supprimer
                              </Button>
                            </div>
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
