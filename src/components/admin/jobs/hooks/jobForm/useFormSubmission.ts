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

  const compressImage = (base64Image: string, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = base64Image;
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateFormData();
    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }

    setIsSubmitting(true);
    
    try {
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
      
      const formData: any = {
        title,
        domain,
        description,
        requirements,
        contract,
        location,
        salary: {
          amount: salary,
          currency: "FCFA"
        },
        positions,
        publishDate: new Date().toISOString().split('T')[0],
        deadline,
        status: isPublished ? "active" : "draft"
      };

      if (processedFeaturedImage) {
        formData.image = processedFeaturedImage;
      }

      if (isHousingOffer) {
        formData.isHousingOffer = true;
        formData.price = price;
        formData.bedrooms = bedrooms;
        formData.bathrooms = bathrooms;
      }
      
      if (processedImages.length > 0) {
        formData.images = processedImages;
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
