
import { Job } from "@/types/job";

export const processStoredImages = (job: Job): Job => {
  if (!job.id) return job;
  
  try {
    const savedImagesStr = localStorage.getItem(`job_images_${job.id}`);
    if (savedImagesStr) {
      const savedImages = JSON.parse(savedImagesStr);
      if (Array.isArray(savedImages) && savedImages.length > 0) {
        console.log(`Images récupérées depuis localStorage pour l'offre ${job.id}`);
        if (!job.images || job.images.length === 0) {
          job.images = savedImages;
        }
        if (!job.image || job.image.trim() === '') {
          job.image = savedImages[0];
        }
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
    const timestamp = Date.now();
    const backupKey = `${key}_backup_${timestamp}`;
    
    // Créer une sauvegarde d'abord
    const existingImages = localStorage.getItem(key);
    if (existingImages) {
      localStorage.setItem(backupKey, existingImages);
    }
    
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
    }
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des images pour l'offre ${jobId}:`, error);
  }
};

export const clearJobImages = (jobId: string): void => {
  if (!jobId) return;
  
  try {
    const timestamp = Date.now();
    const key = `job_images_${jobId}`;
    const backupKey = `${key}_backup_${timestamp}`;
    
    // Créer une sauvegarde avant suppression
    const existingImages = localStorage.getItem(key);
    if (existingImages) {
      localStorage.setItem(backupKey, existingImages);
    }
    
    localStorage.removeItem(key);
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

