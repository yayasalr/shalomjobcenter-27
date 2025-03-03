
import { useFormState } from "./formState";
import { useImageHandlers } from "./imageHandlers";
import { useDialogHandlers } from "./dialogHandlers";
import { useFormSubmission } from "./formSubmission";
import { Listing } from "@/types/listing";

interface UseListingFormProps {
  selectedListing: Listing | null;
  isEditing: boolean;
  onSave: (formData: any) => void;
  onCancel: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

/**
 * Main hook combining all form functionalities
 */
export const useListingForm = ({
  selectedListing,
  isEditing,
  onSave,
  onCancel,
  isOpen,
  setIsOpen
}: UseListingFormProps) => {
  // Form state management
  const {
    formState,
    errors,
    isSubmitting,
    setErrors,
    setIsSubmitting,
    updateFormState,
    handleNeighborhoodChange,
    resetForm
  } = useFormState(selectedListing, isEditing);

  // Image handling
  const {
    images,
    imagePreviews,
    handleImageChange,
    removeImage,
    resetImages,
    loadImagesFromListing
  } = useImageHandlers();

  // Dialog management
  const {
    dialogOpen,
    handleCancel,
    handleDialogChange
  } = useDialogHandlers({
    isOpen,
    setIsOpen,
    onCancel
  });

  // Form submission
  const {
    validateForm,
    handleSubmit
  } = useFormSubmission(
    formState,
    images,
    imagePreviews,
    setErrors,
    setIsSubmitting,
    resetForm,
    resetImages,
    setIsOpen || (() => {}),
    onSave,
    selectedListing,
    isEditing
  );

  // Load images when listing changes
  if (selectedListing && isEditing) {
    loadImagesFromListing(selectedListing);
  }

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
