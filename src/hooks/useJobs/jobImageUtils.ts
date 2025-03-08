
import { Job } from "@/types/job";

// Vérifie si une URL est au format base64
const isBase64Image = (url: string): boolean => {
  return url && typeof url === 'string' && url.startsWith('data:image/');
};

// Vérifie si une URL est au format http/https
const isValidHttpUrl = (url: string): boolean => {
  try {
    return url && typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
  } catch {
    return false;
  }
};

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
          job.images = savedImages;
          if (!job.image) {
            job.image = savedImages[0];
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
          job.images = latestImages;
          if (!job.image) {
            job.image = latestImages[0];
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
        job.image = featuredImage.replace(/"/g, '');
        console.log(`Image principale récupérée pour l'offre ${job.id}:`, job.image);
      } else if (latestFeaturedImage && !hasValidMainImage) {
        job.image = latestFeaturedImage.replace(/"/g, '');
        console.log(`Image principale récupérée depuis 'latest' pour l'offre ${job.id}:`, job.image);
      } else if (job.images && job.images.length > 0) {
        job.image = job.images[0];
        console.log(`Image principale définie à partir des images pour l'offre ${job.id}:`, job.image);
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des images de l'offre ${job.id}:`, error);
  }
  
  return job;
};

export const saveJobImages = (jobId: string, images: string[]): void => {
  if (!jobId || !images || images.length === 0) return;
  
  try {
    const key = `job_images_${jobId}`;
    
    // Filtrer les images valides (base64 ou http/https)
    const validImages = images.filter(img => 
      img && 
      typeof img === 'string' && 
      (img.startsWith('data:image/') || 
       img.startsWith('http') || 
       img.startsWith('https'))
    );
    
    if (validImages.length > 0) {
      localStorage.setItem(key, JSON.stringify(validImages));
      console.log(`Images valides sauvegardées pour l'offre ${jobId}:`, validImages.length);
      
      // Sauvegarder également l'image principale
      if (validImages[0]) {
        localStorage.setItem(`job_featured_image_${jobId}`, validImages[0]);
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des images pour l'offre ${jobId}:`, error);
  }
};

export const clearJobImages = (jobId: string): void => {
  if (!jobId) return;
  
  try {
    const key = `job_images_${jobId}`;
    localStorage.removeItem(key);
    localStorage.removeItem(`job_featured_image_${jobId}`);
    console.log(`Images supprimées pour l'offre ${jobId}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression des images pour l'offre ${jobId}:`, error);
  }
};

export const purgeAllJobImages = (): void => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('job_images_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`${keysToRemove.length} entrées d'images d'offres supprimées du localStorage`);
  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les images:', error);
  }
};
