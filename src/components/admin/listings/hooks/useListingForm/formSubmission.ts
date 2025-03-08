
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

      // IMPORTANT: Gérer correctement les images
      if (imagePreviews.length > 0) {
        console.log("Utilisation des images téléchargées:", imagePreviews);
        
        // Création d'une sauvegarde persistante des URLs d'images
        try {
          // Stocker les URLs pour les récupérer après rechargement
          localStorage.setItem('last_listing_images', JSON.stringify(imagePreviews));
          
          // Stocker chaque URL individuellement comme sauvegarde
          imagePreviews.forEach((url, idx) => {
            localStorage.setItem(`listing_image_${Date.now()}_${idx}`, url);
          });
          
          console.log("Images sauvegardées de manière persistante");
        } catch (err) {
          console.error("Erreur lors de la sauvegarde persistante des images:", err);
        }
        
        // Utiliser la première image comme image principale
        formData.image = imagePreviews[0];
        // Conserver toutes les images dans le tableau images
        formData.images = [...imagePreviews];
      } 
      // En mode édition, si aucune nouvelle image n'est fournie ET que nous avons des images existantes
      else if (isEditing && selectedListing && 
              ((selectedListing.images && selectedListing.images.length > 0) || selectedListing.image)) {
        console.log("Mode édition: conservation des images existantes");
        
        if (selectedListing.image) {
          formData.image = selectedListing.image;
          console.log("Conservation de l'image principale:", selectedListing.image);
        }
        
        if (selectedListing.images && selectedListing.images.length > 0) {
          formData.images = [...selectedListing.images];
          console.log("Conservation des images additionnelles:", selectedListing.images);
        }
      }

      console.log("Données de formulaire finales avant enregistrement:", formData);
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
