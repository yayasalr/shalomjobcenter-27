
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Listing } from "@/types/listing";
import { validateListingForm } from "../utils/formValidation";
import { ValidationErrors } from "../form/BasicInfoSection";

interface UseListingFormProps {
  selectedListing: Listing | null;
  isEditing: boolean;
  onSave: (formData: any) => void;
  onCancel: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export const useListingForm = ({
  selectedListing,
  isEditing,
  onSave,
  onCancel,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen
}: UseListingFormProps) => {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    neighborhood: "",
    mapLocation: ""
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const dialogOpen = externalIsOpen !== undefined ? externalIsOpen : open;
  const setDialogOpen = externalSetIsOpen || setOpen;

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
    
    setImages([]);
    
    if (listing.images && listing.images.length > 0) {
      setImagePreviews(listing.images.filter(img => !img.startsWith('blob:')));
    } else if (listing.image && !listing.image.startsWith('blob:')) {
      setImagePreviews([listing.image]);
    } else {
      setImagePreviews([]);
    }

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
    setImages([]);
    setImagePreviews([]);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
      
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: undefined }));
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors = validateListingForm(formState, imagePreviews, isEditing);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    try {
      const formData: any = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        price: parseFloat(formState.price),
        location: formState.location.trim(),
        mapLocation: formState.mapLocation.trim()
      };

      if (selectedListing && isEditing) {
        formData.id = selectedListing.id;
        formData.rating = selectedListing.rating;
        formData.dates = selectedListing.dates;
        formData.host = selectedListing.host;
        
        if (images.length === 0) {
          formData.image = selectedListing.image;
          formData.images = selectedListing.images;
        }
      }

      if (images.length > 0) {
        const imageUrls = images.map(file => URL.createObjectURL(file));
        formData.image = imageUrls[0];
        formData.images = imageUrls;
      }

      await onSave(formData);
      toast.success(isEditing ? "Logement mis à jour avec succès" : "Logement ajouté avec succès");
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error("Erreur lors de l'enregistrement du logement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setDialogOpen(false);
    onCancel();
  };

  const handleDialogChange = (isOpen: boolean) => {
    setDialogOpen(isOpen);
    if (!isOpen) {
      handleCancel();
    }
  };

  return {
    formState,
    images,
    imagePreviews,
    dialogOpen,
    errors,
    isSubmitting,
    updateFormState,
    handleNeighborhoodChange,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleCancel,
    handleDialogChange
  };
};
