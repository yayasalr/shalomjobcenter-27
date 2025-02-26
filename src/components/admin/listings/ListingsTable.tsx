
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye, ExternalLink } from "lucide-react";
import { Listing } from '@/types/listing';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ListingsTableProps {
  listings: Listing[];
  onEdit: (listing: Listing) => void;
  onDelete: (listingId: string) => void;
}

export const ListingsTable: React.FC<ListingsTableProps> = ({
  listings,
  onEdit,
  onDelete,
}) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Vérification et correction des images
  const validateImage = (imageUrl: string): string => {
    // Liste d'images de secours
    const fallbackImages = [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", // Villa moderne
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // Maison élégante
      "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800", // Appartement contemporain
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", // Logement lumineux
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"  // Intérieur moderne
    ];
    
    // Si l'URL est vide ou commence par blob:
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    }
    
    // Autres cas, retourner l'URL d'origine
    return imageUrl;
  };

  const handleShowDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setDialogOpen(true);
  };

  // Conversion du prix en FCFA
  const convertToFCFA = (euroAmount: number): string => {
    const fcfaAmount = Math.round(euroAmount * 655.957);
    return fcfaAmount.toLocaleString('fr-FR');
  };

  // Vérifier les images d'un logement avant édition
  const handleEditListing = (listing: Listing) => {
    // Vérifier si les images blob sont présentes et avertir
    const hasInvalidImages = listing.images?.some(img => img.startsWith('blob:')) || false;
    
    if (hasInvalidImages) {
      toast.warning(
        "Ce logement contient des images temporaires qui ne seront pas sauvegardées correctement. Veuillez télécharger de nouvelles images.",
        { duration: 5000 }
      );
    }
    
    onEdit(listing);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listings.map((listing) => (
              <tr key={listing.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div 
                    className="relative w-20 h-20 cursor-pointer group rounded-lg overflow-hidden"
                    onClick={() => handleShowDetails(listing)}
                  >
                    <img
                      src={validateImage(listing.image)}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                      <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{listing.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {convertToFCFA(listing.price)} FCFA
                    <span className="text-xs text-gray-500 ml-1">({listing.price}€)</span>
                  </div>
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
                      onClick={() => onDelete(listing.id)}
                      className="gap-2"
                    >
                      <Trash className="h-4 w-4" />
                      Supprimer
                    </Button>
                    <Link to={`/logement/${listing.id}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Voir
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Détails du logement dans une boîte de dialogue */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails du logement</DialogTitle>
            <DialogDescription>
              {selectedListing?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedListing && (
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="details">Informations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="photos">
                {selectedListing.images && selectedListing.images.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {selectedListing.images.map((img, idx) => (
                        <CarouselItem key={idx}>
                          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
                            <img 
                              src={validateImage(img)} 
                              alt={`${selectedListing.title} - Vue ${idx + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
                              }}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                ) : (
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
                    <img 
                      src={validateImage(selectedListing.image)} 
                      alt={selectedListing.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
                      }}
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="details">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Titre</h3>
                    <p className="mt-1">{selectedListing.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Localisation</h3>
                    <p className="mt-1">{selectedListing.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Prix</h3>
                    <p className="mt-1">
                      {convertToFCFA(selectedListing.price)} FCFA ({selectedListing.price}€)
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Note</h3>
                    <p className="mt-1 flex items-center">
                      <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {selectedListing.rating}
                    </p>
                  </div>
                  {selectedListing.description && (
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1">{selectedListing.description}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Hôte</h3>
                    <div className="mt-1 flex items-center">
                      <img 
                        src={selectedListing.host.image || "/placeholder.svg"} 
                        alt={selectedListing.host.name}
                        className="h-8 w-8 rounded-full mr-2"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                      <span>{selectedListing.host.name}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
