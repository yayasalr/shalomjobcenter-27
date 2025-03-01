
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  };

  // Extract neighborhood from location string
  const extractNeighborhood = (location: string): string => {
    const parts = location.split(',');
    return parts.length > 0 ? parts[0].trim() : "";
  };

  // Form state updaters
  const updateFormState = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  // Update neighborhood and location together
  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNeighborhood = e.target.value;
    updateFormState("neighborhood", newNeighborhood);
    updateFormState("location", `${newNeighborhood}, Lomé, Togo`);
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
  };

  // Handle image changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  // Form submission handler
  const handleSubmit = () => {
    if (!formState.title || !formState.price || !formState.location) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (isNaN(parseFloat(formState.price)) || parseFloat(formState.price) <= 0) {
      toast.error("Le prix doit être un nombre positif");
      return;
    }

    const formData: any = {
      title: formState.title,
      description: formState.description,
      price: parseFloat(formState.price),
      location: formState.location,
      mapLocation: formState.mapLocation
    };

    // If editing an existing listing
    if (selectedListing && isEditing) {
      formData.id = selectedListing.id;
      formData.rating = selectedListing.rating;
      formData.dates = selectedListing.dates;
      formData.host = selectedListing.host;
      
      // Conserver les images existantes si aucune nouvelle image n'a été ajoutée
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

    onSave(formData);
    resetForm();
    setDialogOpen(false);
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
          />

          {/* Section de localisation */}
          <LocationSection 
            neighborhood={formState.neighborhood}
            location={formState.location}
            mapLocation={formState.mapLocation}
            handleNeighborhoodChange={handleNeighborhoodChange}
            setLocation={(loc) => updateFormState("location", loc)}
            setMapLocation={(map) => updateFormState("mapLocation", map)}
          />

          {/* Section d'upload d'images */}
          <ImageUploadSection 
            imagePreviews={imagePreviews} 
            onImageChange={handleImageChange}
            removeImage={removeImage}
          />
        </div>

        <DialogFooter className="bg-gray-50 p-4 rounded-b-lg">
          <DialogActions 
            onCancel={onCancel}
            onSubmit={handleSubmit}
            isEditing={isEditing}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
