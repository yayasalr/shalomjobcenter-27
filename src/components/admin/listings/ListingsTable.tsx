
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
                      className="gap