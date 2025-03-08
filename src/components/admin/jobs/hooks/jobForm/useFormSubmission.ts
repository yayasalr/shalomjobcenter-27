
import { useState } from 'react';
import { toast } from "sonner";
import { JobFormState, JobFormStateWithSetters, UseJobFormProps } from './types';
import { JobDomain, JobContract } from '@/types/job';
import { convertBlobToBase64 } from '@/hooks/useJobs/jobImageUtils';

export interface UseFormSubmissionParams extends JobFormStateWithSetters {
  onSave: UseJobFormProps['onSave'];
  onCancel: UseJobFormProps['onCancel'];
}

export const useFormSubmission = ({
  title,
  domain,
  description,
  requirements,
  contract,
  location,
  salary,
  positions,
  deadline,
  isHousingOffer,
  price,
  bedrooms,
  bathrooms,
  images,
  isPublished,
  featuredImage,
  setIsSubmitting,
  setIsOpen,
  onSave,
  onCancel
}: UseFormSubmissionParams) => {
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onCancel();
    }
  };

  const validateFormData = () => {
    const errors = [];
    
    if (!title || title.trim() === '') {
      errors.push("Le titre est obligatoire");
    }
    
    if (!description || description.trim() === '') {
      errors.push("La description est obligatoire");
    }
    
    if (!location || location.trim() === '') {
      errors.push("La localisation est obligatoire");
    }
    
    if (!deadline) {
      errors.push("La date limite est obligatoire");
    }
    
    if (isHousingOffer) {
      if (!price || price <= 0) {
        errors.push("Le prix du logement est obligatoire et doit être supérieur à 0");
      }
      
      if (!bedrooms || bedrooms <= 0) {
        errors.push("Le nombre de chambres doit être supérieur à 0");
      }
      
      if (!bathrooms || bathrooms <= 0) {
        errors.push("Le nombre de salles de bain doit être supérieur à 0");
      }
    } else {
      if (!positions || positions <= 0) {
        errors.push("Le nombre de postes doit être supérieur à 0");
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors = validateFormData();
    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Process featured image (convert blob to base64)
      let processedFeaturedImage = featuredImage;
      if (featuredImage && featuredImage.startsWith('blob:')) {
        try {
          processedFeaturedImage = await convertBlobToBase64(featuredImage);
          console.log("Image principale convertie de blob vers base64");
        } catch (error) {
          console.error("Erreur de conversion de l'image principale:", error);
          processedFeaturedImage = ""; // Use empty string if conversion fails
        }
      }
      
      // Process all images (convert blobs to base64)
      let processedImages: string[] = [];
      if (images && images.length > 0) {
        const processPromises = images.map(async (img) => {
          if (img.startsWith('blob:')) {
            try {
              return await convertBlobToBase64(img);
            } catch (error) {
              console.error("Erreur de conversion d'image:", error);
              return ''; // Skip this image
            }
          }
          return img;
        });
        
        processedImages = (await Promise.all(processPromises)).filter(img => img !== '');
        console.log(`${processedImages.length} images traitées pour soumission`);
      }
      
      const formData: any = {
        title,
        domain,
        description,
        requirements,
        contract,
        location,
        salary: {
          amount: salary,
          currency: "EUR"
        },
        positions,
        publishDate: new Date().toISOString().split('T')[0],
        deadline,
        status: isPublished ? "active" : "draft"
      };

      // Add featured image if available
      if (processedFeaturedImage) {
        formData.image = processedFeaturedImage;
      }

      // Si c'est une offre de logement, ajoutez les propriétés spécifiques
      if (isHousingOffer) {
        formData.isHousingOffer = true;
        formData.price = price;
        formData.bedrooms = bedrooms;
        formData.bathrooms = bathrooms;
        
        // Add processed images
        if (processedImages.length > 0) {
          formData.images = processedImages;
        }
      }

      // Sauvegarder dans localStorage pour référence future
      if (processedFeaturedImage) {
        localStorage.setItem('job_featured_image_latest', processedFeaturedImage);
      }
      
      if (processedImages && processedImages.length > 0) {
        localStorage.setItem('job_images_latest', JSON.stringify(processedImages));
      }
      
      console.log("Données finales soumises:", formData);
      await onSave(formData);
      toast.success("Offre publiée avec succès");
      handleOpenChange(false);
    } catch (error) {
      console.error('Error submitting job:', error);
      toast.error("Une erreur est survenue lors de la publication");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour convertir les types pour les props de FormFields
  const handleDomainChange = (value: string) => {
    return value as JobDomain;
  };

  const handleContractChange = (value: string) => {
    return value as JobContract;
  };

  return {
    handleOpenChange,
    handleSubmit,
    handleDomainChange,
    handleContractChange
  };
};
