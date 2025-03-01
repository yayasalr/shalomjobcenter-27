
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { BasicInfoSection } from "./form/BasicInfoSection";
import { LocationSection } from "./form/LocationSection";
import { ImageUploadSection } from "./form/ImageUploadSection";
import { DialogActions } from "./form/DialogActions";

interface ListingFormDialogProps {
  selectedListing: Listing | null;
  isEditing: boolean;
  onSave: (formData: any) => void;
  onCancel: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

// Define validation errors interface
interface ValidationErrors {
  title?: string;
  description?: string;
  price?: string;
  location?: string;
  neighborhood?: string;
  images?: string;
}

export const ListingFormDialog = ({
  selectedListing,
  isEditing,
  onSave,
  onCancel,
  isOpen,
  setIsOpen
}: ListingFormDialogProps) => {
  // State declarations
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

  // Use isOpen from props if provided
  const dialogOpen = isOpen !== undefined ? isOpen : open;
  const setDialogOpen = setIsOpen || setOpen;

  // Load selected listing data when editing
  useEffect(() => {
    if (selectedListing && isEditing) {
      loadListingData(selectedListing);
    } else if (!isEditing) {
      resetForm();
    }
  }, [selectedListing, isEditing]);

  // Load listing data from the selected listing
  const loadListingData = (listing: Listing) => {
    setFormState({
      title: listing.title,
      description: listing.description || "",
      price: listing.price.toString(),
      location: listing.location,
      neighborhood: extractNeighborhood(listing.location),
      mapLocation: listing.mapLocation || ""
    });
    
    // Reset images and set previews
    setImages([]);
    
    if (listing.images && listing.images.length > 0) {
      setImagePreviews(listing.images.filter(img => !img.startsWith('blob:')));
    } else if (listing.image && !listing.image.startsWith('blob:')) {
      setImagePreviews([listing.image]);
    } else {
      setImagePreviews([]);
    }

    // Clear any previous errors
    setErrors({});
  };

  // Extract neighborhood from location string
  const extractNeighborhood = (location: string): string => {
    const parts = location.split(',');
    return parts.length > 0 ? parts[0].trim() : "";
  };

  // Form state updaters
  const updateFormState = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Update neighborhood and location together
  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNeighborhood = e.target.value;
    updateFormState("neighborhood", newNeighborhood);
    updateFormState("location", `${newNeighborhood}, Lomé, Togo`);
    
    // Clear neighborhood and location errors
    setErrors(prev => ({ 
      ...prev, 
      neighborhood: undefined,
      location: undefined 
    }));
  };

  // Reset the form to initial state
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

  // Handle image changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
      
      // Clear image error if any
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: undefined }));
      }
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Title validation
    if (!formState.title.trim()) {
      newErrors.title = "Le titre est obligatoire";
    } else if (formState.title.length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    } else if (formState.title.length > 100) {
      newErrors.title = "Le titre ne doit pas dépasser 100 caractères";
    }
    
    // Description validation - optional but with min length if provided
    if (formState.description && formState.description.length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères";
    }
    
    // Price validation
    if (!formState.price) {
      newErrors.price = "Le prix est obligatoire";
    } else {
      const priceValue = parseFloat(formState.price);
      if (isNaN(priceValue)) {
        newErrors.price = "Le prix doit être un nombre valide";
      } else if (priceValue <= 0) {
        newErrors.price = "Le prix doit être supérieur à 0";
      } else if (priceValue > 10000000) {
        newErrors.price = "Le prix semble trop élevé";
      }
    }
    
    // Location validation
    if (!formState.location.trim()) {
      newErrors.location = "La localisation est obligatoire";
    }
    
    // Neighborhood validation
    if (!formState.neighborhood.trim()) {
      newErrors.neighborhood = "Le quartier est obligatoire";
    }
    
    // Images validation - only required for new listings
    if (!isEditing && imagePreviews.length === 0) {
      newErrors.images = "Au moins une image est requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
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

      // If editing an existing listing
      if (selectedListing && isEditing) {
        formData.id = selectedListing.id;
        formData.rating = selectedListing.rating;
        formData.dates = selectedListing.dates;
        formData.host = selectedListing.host;
        
        // Preserve existing images if no new images are added
        if (images.length === 0) {
          formData.image = selectedListing.image;
          formData.images = selectedListing.images;
        }
      }

      // Process new images
      if (images.length > 0) {
        const imageUrls = images.map(file => URL.createObjectURL(file));
        formData.image = imageUrls[0]; // First image as main image
        formData.images = imageUrls; // All images in an array
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

  return (
    <Dialog open={dialogOpen} onOpenChange={(isOpen) => {
      setDialogOpen(isOpen);
      if (!isOpen) onCancel();
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditing ? "Modifier un logement" : "Ajouter un logement"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditing
              ? "Mettez à jour les informations du logement"
              : "Remplissez le formulaire pour ajouter un nouveau logement"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Section des informations de base */}
          <BasicInfoSection 
            title={formState.title}
            description={formState.description}
            price={formState.price}
            setTitle={(title) => updateFormState("title", title)}
            setDescription={(desc) => updateFormState("description", desc)}
            setPrice={(price) => updateFormState("price", price)}
            errors={errors}
          />

          {/* Section de localisation */}
          <LocationSection 
            neighborhood={formState.neighborhood}
            location={formState.location}
            mapLocation={formState.mapLocation}
            handleNeighborhoodChange={handleNeighborhoodChange}
            setLocation={(loc) => updateFormState("location", loc)}
            setMapLocation={(map) => updateFormState("mapLocation", map)}
            errors={errors}
          />

          {/* Section d'upload d'images */}
          <ImageUploadSection 
            imagePreviews={imagePreviews} 
            onImageChange={handleImageChange}
            removeImage={removeImage}
            error={errors.images}
          />
        </div>

        <DialogFooter className="bg-gray-50 p-4 rounded-b-lg">
          <DialogActions 
            onCancel={onCancel}
            onSubmit={handleSubmit}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
