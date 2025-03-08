
import { UseJobFormProps } from './jobForm/types';
import { useFormState } from './jobForm/useFormState';
import { useImageHandlers } from './jobForm/useImageHandlers';
import { useFormSubmission } from './jobForm/useFormSubmission';
import { useFormReset } from './jobForm/useFormReset';
import { useEffect } from 'react';

export const useJobForm = (props: UseJobFormProps) => {
  // Get form state and setters
  const formState = useFormState(props);
  
  // Extract necessary values for other hooks
  const {
    isHousingOffer,
    images,
    setImages,
    setFeaturedImage,
    setIsUploading,
    setIsSubmitting,
    isOpen,
    setIsOpen,
    featuredImage
  } = formState;

  // Setup image handlers
  const imageHandlers = useImageHandlers({
    images,
    setImages,
    setFeaturedImage,
    setIsUploading
  });

  // Modified image handlers to include isHousingOffer
  const handleFeaturedImageUpload = () => imageHandlers.handleFeaturedImageUpload(isHousingOffer);
  const handleAddImage = () => imageHandlers.handleAddImage(isHousingOffer);
  const handleRemoveImage = imageHandlers.handleRemoveImage;

  // Setup form submission
  const formSubmission = useFormSubmission({
    ...formState,
    onSave: props.onSave,
    onCancel: props.onCancel
  });

  // Setup form reset
  const { resetForm } = useFormReset(formState);
  
  // Effet pour récupérer les images sauvegardées temporairement
  useEffect(() => {
    // Chargement des images temporaires du localStorage
    const loadTemporaryImages = () => {
      try {
        // Essayer de récupérer les images additionnelles
        const latestImagesStr = localStorage.getItem('job_images_latest');
        if (latestImagesStr && (!images || images.length === 0)) {
          const latestImages = JSON.parse(latestImagesStr);
          if (Array.isArray(latestImages) && latestImages.length > 0) {
            console.log("Images additionnelles récupérées depuis localStorage:", latestImages);
            setImages(latestImages);
          }
        }
        
        // Essayer de récupérer l'image principale
        const latestFeaturedImage = localStorage.getItem('job_featured_image_latest');
        if (latestFeaturedImage && !featuredImage) {
          // Supprimer les guillemets si présents
          const cleanedImage = latestFeaturedImage.replace(/"/g, '');
          console.log("Image principale récupérée depuis localStorage:", cleanedImage);
          setFeaturedImage(cleanedImage);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des images temporaires:", error);
      }
    };
    
    if (isOpen) {
      loadTemporaryImages();
    }
  }, [isOpen, images, featuredImage, setImages, setFeaturedImage]);

  return {
    ...formState,
    resetForm,
    handleFeaturedImageUpload,
    handleAddImage,
    handleRemoveImage,
    handleOpenChange: formSubmission.handleOpenChange,
    handleSubmit: formSubmission.handleSubmit,
    handleDomainChange: formSubmission.handleDomainChange,
    handleContractChange: formSubmission.handleContractChange
  };
};
