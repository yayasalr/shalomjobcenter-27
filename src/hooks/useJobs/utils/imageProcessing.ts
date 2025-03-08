
import { Job } from "@/types/job";
import { isBase64Image, isValidHttpUrl, isBlobUrl } from "./imageValidation";

/**
 * Traite les images stockées pour une offre d'emploi
 */
export const processStoredImages = (job: Job): Job => {
  if (!job.id) return job;
  
  try {
    // Vérifier si l'image principale existe déjà et est valide
    const hasValidMainImage = job.image && (isBase64Image(job.image) || isValidHttpUrl(job.image));
    
    // Vérifier si les images supplémentaires existent déjà et sont valides
    const hasValidImages = job.images && 
                          Array.isArray(job.images) && 
                          job.images.length > 0 && 
                          job.images.every(img => isBase64Image(img) || isValidHttpUrl(img));
    
    // Si l'offre a déjà des images valides, ne rien faire
    if (hasValidMainImage && hasValidImages) {
      console.log(`L'offre ${job.id} a déjà des images valides, aucune récupération nécessaire`);
      return job;
    }
    
    // Récupérer les images depuis localStorage
    const savedImagesKey = `job_images_${job.id}`;
    const savedImagesStr = localStorage.getItem(savedImagesKey);
    
    const latestImagesStr = localStorage.getItem('job_images_latest');
    
    // Vérifier plusieurs sources d'images
    if (savedImagesStr) {
      try {
        const savedImages = JSON.parse(savedImagesStr);
        if (Array.isArray(savedImages) && savedImages.length > 0) {
          console.log(`Images récupérées depuis localStorage pour l'offre ${job.id}`);
          job.images = savedImages.filter(img => isBase64Image(img) || isValidHttpUrl(img));
          if (!job.image && job.images.length > 0) {
            job.image = job.images[0];
          }
        }
      } catch (e) {
        console.error(`Erreur de parsing pour ${savedImagesKey}:`, e);
      }
    } else if (latestImagesStr && !hasValidImages) {
      try {
        const latestImages = JSON.parse(latestImagesStr);
        if (Array.isArray(latestImages) && latestImages.length > 0) {
          console.log(`Images récupérées depuis 'latest' pour l'offre ${job.id}`);
          job.images = latestImages.filter(img => isBase64Image(img) || isValidHttpUrl(img));
          if (!job.image && job.images.length > 0) {
            job.image = job.images[0];
          }
        }
      } catch (e) {
        console.error(`Erreur de parsing pour job_images_latest:`, e);
      }
    }
    
    // Récupérer l'image principale si nécessaire
    if (!job.image || !isValidHttpUrl(job.image)) {
      const featuredImageKey = `job_featured_image_${job.id}`;
      const featuredImage = localStorage.getItem(featuredImageKey);
      const latestFeaturedImage = localStorage.getItem('job_featured_image_latest');
      
      if (featuredImage) {
        try {
          // Essayer de nettoyer l'image
          if (featuredImage.startsWith('"') && featuredImage.endsWith('"')) {
            job.image = featuredImage.substring(1, featuredImage.length - 1);
          } else {
            job.image = featuredImage;
          }
          console.log(`Image principale récupérée pour l'offre ${job.id}:`, job.image);
        } catch (e) {
          console.error(`Erreur lors du traitement de l'image principale pour ${job.id}:`, e);
        }
      } else if (latestFeaturedImage && !hasValidMainImage) {
        try {
          // Essayer de nettoyer l'image
          if (latestFeaturedImage.startsWith('"') && latestFeaturedImage.endsWith('"')) {
            job.image = latestFeaturedImage.substring(1, latestFeaturedImage.length - 1);
          } else {
            job.image = latestFeaturedImage;
          }
          console.log(`Image principale récupérée depuis 'latest' pour l'offre ${job.id}:`, job.image);
        } catch (e) {
          console.error(`Erreur lors du traitement de l'image principale depuis 'latest' pour ${job.id}:`, e);
        }
      } else if (job.images && job.images.length > 0) {
        job.image = job.images[0];
        console.log(`Image principale définie à partir des images pour l'offre ${job.id}:`, job.image);
      }
    }
    
    // S'assurer que nous n'avons pas de blob URLs (qui ne persisteront pas)
    if (job.image && isBlobUrl(job.image)) {
      console.warn(`Image principale en format blob trouvée pour l'offre ${job.id}, remplacement par défaut`);
      job.image = "https://source.unsplash.com/random/800x600/?work";
    }
    
    if (job.images) {
      const hasBlobs = job.images.some(img => isBlobUrl(img));
      if (hasBlobs) {
        console.warn(`Images blob trouvées pour l'offre ${job.id}, filtrage`);
        job.images = job.images.filter(img => !isBlobUrl(img));
        if (job.images.length === 0) {
          job.images = ["https://source.unsplash.com/random/800x600/?work"];
        }
      }
    }
    
  } catch (error) {
    console.error(`Erreur lors de la récupération des images de l'offre ${job.id}:`, error);
  }
  
  return job;
};
