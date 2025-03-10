
import React, { useState, useEffect } from 'react';
import { getDomainImage } from '../../utils/jobUtils';
import { AlertTriangle } from 'lucide-react';

interface GalleryImageProps {
  src: string;
  alt: string;
  isFullScreen: boolean;
  isLoading: boolean;
  onLoad: () => void;
  onError: () => void;
  hasError: boolean;
  domain?: string;
}

export const GalleryImage: React.FC<GalleryImageProps> = ({
  src,
  alt,
  isFullScreen,
  isLoading,
  onLoad,
  onError,
  hasError,
  domain,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [localError, setLocalError] = useState<boolean>(false);
  
  // Update image source when src prop changes
  useEffect(() => {
    setImgSrc(src);
    setLocalError(false);
  }, [src]);

  const handleError = () => {
    setLocalError(true);
    
    // Try a domain-specific fallback first
    if (domain) {
      setImgSrc(getDomainImage(domain));
    } else {
      // General fallback
      setImgSrc("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800");
    }
    
    // Notify parent component
    onError();
  };

  return (
    <div className="relative h-full flex items-center justify-center bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sholom-primary"></div>
        </div>
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-contain ${isFullScreen ? 'max-h-screen' : 'max-h-[600px]'}`}
        onLoad={onLoad}
        onError={handleError}
      />
      
      {(hasError || localError) && (
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-100 border border-red-300 rounded-md flex items-center gap-2 text-sm text-red-700">
          <AlertTriangle size={16} />
          <span>Certaines images n'ont pas pu être chargées et ont été remplacées par des images par défaut.</span>
        </div>
      )}
    </div>
  );
};
