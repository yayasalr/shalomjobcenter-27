
import React, { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { ChevronLeft, ChevronRight, Maximize, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDomainImage } from '../utils/jobUtils';

interface JobGalleryProps {
  job: Job;
  className?: string;
}

export const JobGallery: React.FC<JobGalleryProps> = ({ job, className }) => {
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

  if (galleryImages.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden min-h-[300px]`}>
        <div className="text-center p-4">
          <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-2" />
          <p className="text-gray-500">Aucune image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${className} relative overflow-hidden rounded-xl ${
        isFullScreen ? 'fixed inset-0 z-50 bg-black' : ''
      }`}
    >
      {/* Image principale */}
      <div className="relative h-full flex items-center justify-center bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        <img
          src={galleryImages[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className={`w-full h-full object-contain ${isFullScreen ? 'max-h-screen' : 'max-h-[600px]'}`}
          onLoad={handleImageLoad}
          onError={() => handleImageError(currentIndex)}
        />
        
        {hasError && (
          <div className="absolute bottom-4 left-4 right-4 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-600">
            Certaines images n'ont pas pu être chargées et ont été remplacées par des images par défaut.
          </div>
        )}
      </div>

      {/* Navigation controls */}
      <div className="absolute inset-0 flex items-center justify-between p-2">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={handleNext}
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-700"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Full screen controls */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <Button
          onClick={toggleFullScreen}
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-700"
        >
          {isFullScreen ? <X className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      {/* Pagination indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs">
          {currentIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {galleryImages.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/20 overflow-x-auto">
          <div className="flex gap-2">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsLoading(true);
                  setCurrentIndex(index);
                }}
                className={`flex-shrink-0 rounded overflow-hidden ${
                  index === currentIndex ? 'ring-2 ring-primary' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-12 w-16 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getDomainImage(job.domain);
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
