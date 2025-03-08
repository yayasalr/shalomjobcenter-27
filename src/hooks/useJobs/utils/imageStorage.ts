
/**
 * Fonctions pour gérer le stockage des images dans localStorage
 */

/**
 * Sauvegarde les images d'une offre d'emploi
 */
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
      
      // Ne plus sauvegarder dans "latest" pour éviter les conflits entre offres
    }
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des images pour l'offre ${jobId}:`, error);
  }
};

/**
 * Supprime les images d'une offre d'emploi
 */
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

/**
 * Supprime toutes les images d'offres du localStorage
 */
export const purgeAllJobImages = (): void => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('job_images_') || key.includes('job_featured_image_'))) {
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
