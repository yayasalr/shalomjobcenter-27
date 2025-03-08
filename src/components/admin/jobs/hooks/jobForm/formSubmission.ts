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
    setIsOpen(open);
    if (!open) {
      onCancel();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location || !deadline) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Conversion des images blob en base64 si nécessaire
      let processedImages = [];
      if (images && images.length > 0) {
        processedImages = await Promise.all(
          images.map(async (img) => {
            if (img.startsWith('blob:')) {
              try {
                const response = await fetch(img);
                const blob = await response.blob();
                return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.readAsDataURL(blob);
                });
              } catch (error) {
                console.error('Erreur de conversion blob vers base64:', error);
                return null;
              }
            }
            return img;
          })
        );
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
        status: isPublished ? "active" : "draft",
        images: processedImages.filter(img => img !== null)
      };

      // Add featured image if available
      if (featuredImage) {
        formData.image = featuredImage;
      }

      // Si c'est une offre de logement, ajoutez les propriétés spécifiques
      if (isHousingOffer) {
        formData.isHousingOffer = true;
        formData.price = price;
        formData.bedrooms = bedrooms;
        formData.bathrooms = bathrooms;
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
