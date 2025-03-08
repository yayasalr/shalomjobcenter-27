
import { toast } from "sonner";
import { validateListingForm } from "../../utils/formValidation";
import { ValidationErrors } from "../../form/BasicInfoSection";
import { Listing } from "@/types/listing";

interface FormSubmissionProps {
  formState: {
    title: string;
    description: string;
    price: string;
    location: string;
    neighborhood: string;
    mapLocation: string;
  };
  images: File[];
  imagePreviews: string[];
  errors: ValidationErrors;
  setErrors: (errors: ValidationErrors) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
  resetImages: () => void;
  setDialogOpen: (isOpen: boolean) => void;
  onSave: (formData: any) => void;
  selectedListing: Listing | null;
  isEditing: boolean;
}

export const useFormSubmission = ({
  formState,
  images,
  imagePreviews,
  errors,
  setErrors,
  isSubmitting,
  setIsSubmitting,
  resetForm,
  resetImages,
  setDialogOpen,
  onSave,
  selectedListing,
  isEditing
}: FormSubmissionProps) => {
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

      // Si nous sommes en mode édition, conserver l'ID et certaines propriétés
      if (selectedListing && isEditing) {
        formData.id = selectedListing.id;
        
        // Conserver les propriétés importantes du listing existant
        if (selectedListing.rating !== undefined) {
          formData.rating = selectedListing.rating;
        }
        if (selectedListing.dates) {
          formData.dates = selectedListing.dates;
        }
        if (selectedListing.host) {
          formData.host = selectedListing.host;
        }
      }

      // GESTION PRIORITAIRE DES NOUVELLES IMAGES
      if (imagePreviews && imagePreviews.length > 0) {
        console.log("PRIORITÉ ABSOLUE aux images téléchargées:", imagePreviews);
        
        // Forcer l'utilisation des nouvelles images avec horodatage
        const timestamp = Date.now();
        
        // Enregistrer en plusieurs emplacements pour garantir la persistance
        localStorage.setItem(`fresh_listing_images_${timestamp}`, JSON.stringify(imagePreviews));
        sessionStorage.setItem(`fresh_listing_images_${timestamp}`, JSON.stringify(imagePreviews));
        
        // Définir comme SEULES images valides
        formData.images = [...imagePreviews];
        
        // Définir la première comme image principale
        if (imagePreviews[0]) {
          formData.image = imagePreviews[0];
          console.log("Image principale définie à partir des nouvelles images:", formData.image);
        }
        
        console.log("Images utilisées pour le nouveau listing:", formData.images);
      } 
      // En mode édition, uniquement si aucune nouvelle image n'est fournie
      else if (isEditing && selectedListing) {
        if (selectedListing.images && selectedListing.images.length > 0) {
          formData.images = [...selectedListing.images];
        }
        
        if (selectedListing.image) {
          formData.image = selectedListing.image;
        }
      }

      console.log("Données finales du formulaire avant enregistrement:", formData);
      await onSave(formData);
      
      toast.success(isEditing ? "Logement mis à jour avec succès" : "Logement ajouté avec succès");
      resetForm();
      resetImages();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error("Erreur lors de l'enregistrement du logement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    validateForm,
    handleSubmit
  };
};
