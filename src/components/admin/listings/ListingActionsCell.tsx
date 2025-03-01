
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash, ExternalLink } from "lucide-react";
import { Listing } from '@/types/listing';
import { Link } from "react-router-dom";
import { checkInvalidImages, showImageWarning } from './utils/listingTableUtils';

interface ListingActionsCellProps {
  listing: Listing;
  onEdit: (listing: Listing) => void;
  onDelete: (listingId: string) => void;
}

export const ListingActionsCell: React.FC<ListingActionsCellProps> = ({
  listing,
  onEdit,
  onDelete
}) => {
  const handleEditListing = (listing: Listing) => {
    // Vérifier si les images blob sont présentes et avertir
    const hasInvalidImages = checkInvalidImages(listing);
    
    if (hasInvalidImages) {
      showImageWarning();
    }
    
    onEdit(listing);
  };

  return (
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
  );
};
