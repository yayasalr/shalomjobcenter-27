
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
import { LOME_NEIGHBORHOODS } from "@/hooks/useListings";
import { toast } from "sonner";
import { BasicInfoSection } from "./form/BasicInfoSection";
import { LocationSection } from "./form/LocationSection";
import { ImageUploadSection } from "./form/ImageUploadSection";

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
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [mapLocation, setMapLocation] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  // Utiliser isOpen du props s'il est fourni
  const dialogOpen = isOpen !== undefined ? isOpen : open;
  const setDialogOpen = setIsOpen || setOpen;

  // Charger les données du logement sélectionné
  useEffect(() => {
    if (selectedListing && isEditing) {
      setTitle(selectedListing.title);
      setDescription(selectedListing.description || "");
      setPrice(selectedListing.price.toString());
      setLocation(selectedListing.location);
      
      // Extraire le quartier de la localisation
      const parts = selectedListing.location.split(',');
      if (parts.length > 0) {
        setNeighborhood(parts[0].trim());
      }
      
      // Si un mapLocation existe, le charger
      if (selectedListing.mapLocation) {
        setMapLocation(selectedListing.mapLocation);
      }
      
      // Réinitialiser les images
      setImages([]);
      
      // Afficher les images existantes comme prévisualisations
      if (selectedListing.images && selectedListing.images.length > 0) {
        setImagePreviews(selectedListing.images.filter(img => !img.startsWith('blob:')));
      } else if (selectedListing.image && !selectedListing.image.startsWith('blob:')) {
        setImagePreviews([selectedListing.image]);
      } else {
        setImagePreviews([]);
      }
    } else if (!isEditing) {
      resetForm();
    }
  }, [selectedListing, isEditing]);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setLocation("");
    setNeighborhood("");
    setMapLocation("");
    setImages([]);
    setImagePreviews([]);
  };

  // Gérer l'upload d'images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  // Supprimer une image
  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // Révoquer l'URL de l'aperçu pour éviter les fuites de mémoire
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  // Mettre à jour la localisation lorsque le quartier change
  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNeighborhood = e.target.value;
    setNeighborhood(newNeighborhood);
    setLocation(`${newNeighborhood}, Lomé, Togo`);
  };

  // Soumettre le formulaire
  const handleSubmit = () => {
    if (!title || !price || !location) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      toast.error("Le prix doit être un nombre positif");
      return;
    }

    const formData: any = {
      title,
      description,
      price: parseFloat(price),
      location,
      mapLocation: mapLocation
    };

    // Si on modifie un logement existant
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

    // Traiter les nouvelles images
    if (images.length > 0) {
      const imageUrls = images.map(file => URL.createObjectURL(file));
      formData.image = imageUrls[0]; // La première image comme image principale
      formData.images = imageUrls; // Toutes les images dans un tableau
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
            title={title}
            description={description}
            price={price}
            setTitle={setTitle}
            setDescription={setDescription}
            setPrice={setPrice}
          />

          {/* Section de localisation */}
          <LocationSection 
            neighborhood={neighborhood}
            location={location}
            mapLocation={mapLocation}
            handleNeighborhoodChange={handleNeighborhoodChange}
            setLocation={setLocation}
            setMapLocation={setMapLocation}
          />

          {/* Section d'upload d'images */}
          <ImageUploadSection 
            imagePreviews={imagePreviews} 
            onImageChange={handleImageChange}
            removeImage={removeImage}
          />
        </div>

        <DialogFooter className="bg-gray-50 p-4 rounded-b-lg">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-sholom-primary hover:bg-sholom-primary/90 text-white"
          >
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
