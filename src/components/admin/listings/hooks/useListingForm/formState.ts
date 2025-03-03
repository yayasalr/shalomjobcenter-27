
import { useState, useEffect } from "react";
import { Listing } from "@/types/listing";

/**
 * Hook for managing the form state
 */
export const useFormState = (selectedListing: Listing | null, isEditing: boolean) => {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    neighborhood: "",
    mapLocation: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (selectedListing && isEditing) {
      loadListingData(selectedListing);
    } else if (!isEditing) {
      resetForm();
    }
  }, [selectedListing, isEditing]);

  const loadListingData = (listing: Listing) => {
    setFormState({
      title: listing.title,
      description: listing.description || "",
      price: listing.price.toString(),
      location: listing.location,
      neighborhood: extractNeighborhood(listing.location),
      mapLocation: listing.mapLocation || ""
    });
    
    setErrors({});
  };

  const extractNeighborhood = (location: string): string => {
    const parts = location.split(',');
    return parts.length > 0 ? parts[0].trim() : "";
  };

  const updateFormState = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNeighborhood = e.target.value;
    updateFormState("neighborhood", newNeighborhood);
    updateFormState("location", `${newNeighborhood}, Lomé, Togo`);
    
    setErrors(prev => ({ 
      ...prev, 
      neighborhood: undefined,
      location: undefined 
    }));
  };

  const resetForm = () => {
    setFormState({
      title: "",
      description: "",
      price: "",
      location: "",
      neighborhood: "",
      mapLocation: ""
    });
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    formState,
    errors,
    isSubmitting,
    setErrors,
    setIsSubmitting,
    updateFormState,
    handleNeighborhoodChange,
    resetForm
  };
};
