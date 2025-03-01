
import React, { useState } from 'react';
import { Listing } from '@/types/listing';
import { ListingImageCell } from './ListingImageCell';
import { ListingActionsCell } from './ListingActionsCell';
import { ListingDetailsDialog } from './ListingDetailsDialog';
import { convertToFCFA } from './utils/listingTableUtils';

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

  const handleShowDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setDialogOpen(true);
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
                  <ListingImageCell
                    listing={listing}
                    onShowDetails={handleShowDetails}
                  />
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
                  <ListingActionsCell
                    listing={listing}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Détails du logement dans une boîte de dialogue */}
      <ListingDetailsDialog
        listing={selectedListing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};
