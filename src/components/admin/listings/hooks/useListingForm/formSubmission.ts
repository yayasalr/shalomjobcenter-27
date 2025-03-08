
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
      // Création des données du formulaire
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

      // Gérer les images - CRITIQUE POUR LA CORRECTION
      if (imagePreviews && imagePreviews.length > 0) {
        console.log("UTILISATION DES IMAGES ACTUELLES POUR LA SOUMISSION:", imagePreviews);
        
        // Assurer que toutes les images ont des URL valides
        const validImagePreviews = imagePreviews.filter(img => img && typeof img === 'string' && img.trim() !== '');
        
        // Utiliser directement les images prévisualisées
        formData.images = [...validImagePreviews];
        
        // Définir la première comme image principale
        if (validImagePreviews[0]) {
          formData.image = validImagePreviews[0];
          console.log("Image principale définie:", formData.image);
        }
        
        // Si on est en mode édition, associer les images au listing par ID
        if (isEditing && selectedListing?.id) {
          const listingId = selectedListing.id;
          localStorage.setItem(`listing_images_${listingId}`, JSON.stringify(validImagePreviews));
          console.log(`Images sauvegardées pour le listing ${listingId}:`, validImagePreviews);
        }
      } else if (selectedListing && selectedListing.images && selectedListing.images.length > 0) {
        // Si pas de nouvelles images mais des images existantes, les conserver
        formData.images = [...selectedListing.images];
        formData.image = selectedListing.image || selectedListing.images[0];
      }
      
      console.log("Données finales du formulaire pour soumission:", formData);
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
