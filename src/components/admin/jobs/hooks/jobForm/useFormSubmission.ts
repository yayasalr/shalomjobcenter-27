
import { useState } from 'react';
import { toast } from "sonner";
import { JobFormState, JobFormStateWithSetters, UseJobFormProps } from './types';
import { JobDomain, JobContract } from '@/types/job';
import { convertBlobToBase64 } from '@/hooks/useJobs/utils/imageConversion';
import { compressImage } from '@/utils/imageProcessing';

export interface UseFormSubmissionParams extends JobFormStateWithSetters {
  onSave: UseJobFormProps['onSave'];
  onCancel: UseJobFormProps['onCancel'];
}

/**
 * Valide les données du formulaire et retourne les erreurs
 */
const validateFormData = (formData: Partial<JobFormState>): string[] => {
  const errors = [];
  
  if (!formData.title || formData.title.trim() === '') {
    errors.push("Le titre est obligatoire");
  }
  
  if (!formData.description || formData.description.trim() === '') {
    errors.push("La description est obligatoire");
  }
  
  if (!formData.location || formData.location.trim() === '') {
    errors.push("La localisation est obligatoire");
  }
  
  if (!formData.deadline) {
    errors.push("La date limite est obligatoire");
  }
  
  if (formData.isHousingOffer) {
    if (!formData.price || formData.price <= 0) {
      errors.push("Le prix du logement est obligatoire et doit être supérieur à 0");
    }
    
    if (!formData.bedrooms || formData.bedrooms <= 0) {
      errors.push("Le nombre de chambres doit être supérieur à 0");
    }
    
    if (!formData.bathrooms || formData.bathrooms <= 0) {
      errors.push("Le nombre de salles de bain doit être supérieur à 0");
    }
  } else {
    if (!formData.positions || formData.positions <= 0) {
      errors.push("Le nombre de postes doit être supérieur à 0");
    }
  }
  
  return errors;
};

/**
 * Traite et compresse les images pour la soumission
 */
const processImagesForSubmission = async (
  images: string[], 
  featuredImage: string
): Promise<{ processedImages: string[], processedFeaturedImage: string }> => {
  // Traiter l'image principale
  let processedFeaturedImage = '';
  if (featuredImage) {
    try {
      let base64Image = featuredImage;
      if (featuredImage.startsWith('blob:')) {
        base64Image = await convertBlobToBase64(featuredImage);
      }
      
      processedFeaturedImage = await compressImage(base64Image, 0.6);
      console.log("Image principale convertie et compressée");
    } catch (error) {
      console.error("Erreur de conversion de l'image principale:", error);
    }
  }
  
  // Traiter les images additionnelles
  let processedImages: string[] = [];
  if (images && images.length > 0) {
    const limitedImages = images.slice(0, 3);
    console.log(`Limitation à ${limitedImages.length} images pour éviter les problèmes de quota`);
    
    const processPromises = limitedImages.map(async (img) => {
      try {
        let base64Img = img;
        if (img.startsWith('blob:')) {
          base64Img = await convertBlobToBase64(img);
        }
        
        return await compressImage(base64Img, 0.5);
      } catch (error) {
        console.error("Erreur de conversion d'image:", error);
        return '';
      }
    });
    
    processedImages = (await Promise.all(processPromises)).filter(img => img !== '');
    console.log(`${processedImages.length} images traitées et compressées pour soumission`);
  }
  
  return { processedImages, processedFeaturedImage };
};

/**
 * Prépare les données du formulaire pour la soumission
 */
const prepareFormData = async (formData: Pick<JobFormState, 
  'title' | 'domain' | 'description' | 'requirements' | 
  'contract' | 'location' | 'salary' | 'positions' | 
  'deadline' | 'isHousingOffer' | 'price' | 'bedrooms' | 
  'bathrooms' | 'images' | 'isPublished' | 'featuredImage'
>): Promise<any> => {
  const { processedImages, processedFeaturedImage } = await processImagesForSubmission(
    formData.images, 
    formData.featuredImage
  );
  
  const jobData: any = {
    title: formData.title,
    domain: formData.domain,
    description: formData.description,
    requirements: formData.requirements,
    contract: formData.contract,
    location: formData.location,
    salary: {
      amount: formData.salary,
      currency: "FCFA"
    },
    positions: formData.positions,
    publishDate: new Date().toISOString().split('T')[0],
    deadline: formData.deadline,
    status: formData.isPublished ? "active" : "draft"
  };

  if (processedFeaturedImage) {
    jobData.image = processedFeaturedImage;
  }

  if (formData.isHousingOffer) {
    jobData.isHousingOffer = true;
    jobData.price = formData.price;
    jobData.bedrooms = formData.bedrooms;
    jobData.bathrooms = formData.bathrooms;
  }
  
  if (processedImages.length > 0) {
    jobData.images = processedImages;
  }
  
  return jobData;
};

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
  onCancel,
  isOpen,
  isSubmitting,
  isUploading
}: UseFormSubmissionParams) => {
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onCancel();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToValidate = {
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
      isOpen,
      isSubmitting,
      isUploading
    };
    
    const errors = validateFormData(formDataToValidate);
    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const jobData = await prepareFormData({
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
        featuredImage
      });
      
      console.log("Données finales soumises:", jobData);
      
      await onSave(jobData);
      toast.success("Offre publiée avec succès");
      handleOpenChange(false);
    } catch (error) {
      console.error('Error submitting job:', error);
      toast.error("Une erreur est survenue lors de la publication");
    } finally {
      setIsSubmitting(false);
    }
  };

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
