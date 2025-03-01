
import { useState, useEffect } from 'react';
import { useListings } from '@/hooks/useListings';
import { Listing } from '@/types/listing';

export const useListingManagement = () => {
  const { listings, isLoading: isLoadingListings, addListing, updateListing, deleteListing } = useListings();
  
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter listings based on search term
  useEffect(() => {
    if (listings) {
      const filtered = listings.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setFilteredListings(filtered);
    }
  }, [listings, searchTerm]);

  const handleSaveListing = async (formData: Omit<Listing, "id">) => {
    try {
      await addListing.mutateAsync(formData);
      setIsListingDialogOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleEditListing = (listing: Listing) => {
    setSelectedListing(listing);
    setIsEditing(true);
    setIsListingDialogOpen(true);
  };

  const handleUpdateListing = async (formData: Omit<Listing, "id">) => {
    if (selectedListing) {
      try {
        await updateListing.mutateAsync({ ...formData, id: selectedListing.id });
        setSelectedListing(null);
        setIsEditing(false);
        setIsListingDialogOpen(false);
      } catch (error) {
        throw error;
      }
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce logement ?")) {
      try {
        await deleteListing.mutateAsync(listingId);
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  const handleCreateListing = () => {
    setSelectedListing(null);
    setIsEditing(false);
    setIsListingDialogOpen(true);
  };

  const handleCancelListing = () => {
    setSelectedListing(null);
    setIsEditing(false);
    setIsListingDialogOpen(false);
  };

  return {
    listings,
    filteredListings,
    isLoadingListings,
    selectedListing,
    isListingDialogOpen,
    setIsListingDialogOpen,
    isEditing,
    searchTerm,
    setSearchTerm,
    handleSaveListing,
    handleEditListing,
    handleUpdateListing,
    handleDeleteListing,
    handleCreateListing,
    handleCancelListing
  };
};
