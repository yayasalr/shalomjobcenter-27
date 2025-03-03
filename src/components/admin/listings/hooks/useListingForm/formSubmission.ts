
import { toast } from "sonner";
import { validateListingForm } from "../../utils/formValidation";

/**
 * Handles form submission logic
 */
export const useFormSubmission = (
  formState: any,
  images: File[],
  imagePreviews: string[],
  setErrors: (errors: any) => void,
  setIsSubmitting: (isSubmitting: boolean) => void,
  resetForm: () => void,
  resetImages: () => void,
  setDialogOpen: (isOpen: boolean) => void,
  onSave: (formData: any) => void,
  selectedListing: any,
  isEditing: boolean
) => {
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
