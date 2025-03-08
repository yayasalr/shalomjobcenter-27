
import { useState } from 'react';
import { toast } from "sonner";
import { JobFormState, JobFormStateWithSetters, UseJobFormProps } from './types';
import { JobDomain, JobContract } from '@/types/job';

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
    if (!open) {
      onCancel();
    }
    setIsOpen(open);
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
    
    // Nettoyer les images blob (qui ne persisteront pas)
    const cleanBlobs = (url?: string) => {
      if (!url) return '';
      return url.startsWith('blob:') ? '' : url;
    };
    
    // Nettoyer les tableaux d'images
    const cleanBlobArray = (urls: string[]) => {
      return urls.filter(url => !url.startsWith('blob:'));
    };
    
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

    // Add featured image if available (clean blob URLs)
    if (featuredImage) {
      formData.image = cleanBlobs(featuredImage);
    }

    // Si c'est une offre de logement, ajoutez les propriétés spécifiques
    if (isHousingOffer) {
      formData.isHousingOffer = true;
      formData.price = price;
      formData.bedrooms = bedrooms;
      formData.bathrooms = bathrooms;
      
      // Clean blob URLs
      formData.images = cleanBlobArray(images);
    }

    try {
      // Sauvegarder dans localStorage pour référence future
      if (featuredImage) {
        localStorage.setItem('job_featured_image_latest', featuredImage);
      }
      
      if (images && images.length > 0) {
        localStorage.setItem('job_images_latest', JSON.stringify(images));
      }
      
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
