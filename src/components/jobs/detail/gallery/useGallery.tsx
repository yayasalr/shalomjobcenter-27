
import { useState, useEffect } from 'react';
import { getDomainImage } from '../../utils/jobUtils';
import { Job } from '@/types/job';
import { toast } from 'sonner';

export const useGallery = (job: Job) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState<Record<number, number>>({});
  
  // Verify and filter images on load
  useEffect(() => {
    const validateImages = () => {
      setIsLoading(true);
      
      // Get main image + additional images 
      let allImages: string[] = [];
      
      // Add main image if it exists
      if (job.image) {
        if (
          (typeof job.image === 'string') && 
          (job.image.startsWith('http') || job.image.startsWith('data:image/'))
        ) {
          allImages.push(job.image);
        }
      }
      
      // Add additional images
      if (job.images && Array.isArray(job.images) && job.images.length > 0) {
        const validImages = job.images.filter(img => 
          (typeof img === 'string') && 
          (img.startsWith('http') || img.startsWith('data:image/'))
        );
        
        // Avoid duplicates
        validImages.forEach(img => {
          if (!allImages.includes(img)) {
            allImages.push(img);
          }
        });
      }
      
      // If no valid images, use a default image
      if (allImages.length === 0) {
        const defaultImage = getDomainImage(job.domain);
        allImages = [defaultImage];
        setHasError(true);
        toast.error("Impossible de charger les images de cette offre");
      }
      
      setGalleryImages(allImages);
      setIsLoading(false);
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
    // Track attempts to prevent infinite retries
    const attempts = loadAttempts[index] || 0;
    setLoadAttempts(prev => ({...prev, [index]: attempts + 1}));
    
    if (attempts > 2) {
      console.error(`Échec définitif de chargement de l'image à l'index ${index}`);
      // Replace with default image
      const newGalleryImages = [...galleryImages];
      newGalleryImages[index] = getDomainImage(job.domain);
      setGalleryImages(newGalleryImages);
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    console.warn(`Tentative ${attempts + 1} de chargement d'image à l'index ${index}`);
    
    // Try with a different version of the same URL (cache busting)
    const currentImage = galleryImages[index];
    if (currentImage.startsWith('http')) {
      const cacheBuster = `?t=${Date.now()}`;
      const newUrl = currentImage.includes('?') 
        ? `${currentImage}&cb=${Date.now()}` 
        : `${currentImage}${cacheBuster}`;
      
      const newGalleryImages = [...galleryImages];
      newGalleryImages[index] = newUrl;
      setGalleryImages(newGalleryImages);
    } else {
      // If not an HTTP URL, just replace with default
      const newGalleryImages = [...galleryImages];
      newGalleryImages[index] = getDomainImage(job.domain);
      setGalleryImages(newGalleryImages);
      setHasError(true);
    }
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
