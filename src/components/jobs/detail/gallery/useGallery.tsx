
import { useState, useEffect } from 'react';
import { getDomainImage } from '../../utils/jobUtils';
import { Job } from '@/types/job';

export const useGallery = (job: Job) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  
  // Vérifier et filtrer les images au chargement
  useEffect(() => {
    const validateImages = () => {
      // Récupérer image principale + images additionnelles 
      let allImages: string[] = [];
      
      // Ajouter l'image principale si elle existe
      if (job.image) {
        if (
          (typeof job.image === 'string') && 
          (job.image.startsWith('http') || job.image.startsWith('data:image/'))
        ) {
          allImages.push(job.image);
        }
      }
      
      // Ajouter les images additionnelles
      if (job.images && Array.isArray(job.images) && job.images.length > 0) {
        const validImages = job.images.filter(img => 
          (typeof img === 'string') && 
          (img.startsWith('http') || img.startsWith('data:image/'))
        );
        
        // Éviter les doublons
        validImages.forEach(img => {
          if (!allImages.includes(img)) {
            allImages.push(img);
          }
        });
      }
      
      // Si aucune image valide, utiliser une image par défaut
      if (allImages.length === 0) {
        allImages = [getDomainImage(job.domain)];
        setHasError(true);
      }
      
      setGalleryImages(allImages);
    };
    
    validateImages();
  }, [job]);

  const handlePrevious = () => {
    setIsLoading(true);
    setCurrentIndex((prevIndex) => (
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    ));
  };

  const handleNext = () => {
    setIsLoading(true);
    setCurrentIndex((prevIndex) => (
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    ));
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = (index: number) => {
    console.error(`Erreur de chargement d'image à l'index ${index}`);
    
    // Remplacer l'image problématique par une image par défaut
    const newGalleryImages = [...galleryImages];
    newGalleryImages[index] = getDomainImage(job.domain);
    setGalleryImages(newGalleryImages);
    setHasError(true);
  };

  return {
    currentIndex,
    setCurrentIndex,
    isFullScreen,
    isLoading,
    setIsLoading,
    galleryImages,
    hasError,
    domain: job.domain,
    handlePrevious,
    handleNext,
    toggleFullScreen,
    handleImageLoad,
    handleImageError
  };
};
