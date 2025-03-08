
import React from 'react';

interface GalleryImageProps {
  src: string;
  alt: string;
  isFullScreen: boolean;
  isLoading: boolean;
  onLoad: () => void;
  onError: () => void;
  hasError: boolean;
}

export const GalleryImage: React.FC<GalleryImageProps> = ({
  src,
  alt,
  isFullScreen,
  isLoading,
  onLoad,
  onError,
  hasError,
}) => {
  return (
    <div className="relative h-full flex items-center justify-center bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain ${isFullScreen ? 'max-h-screen' : 'max-h-[600px]'}`}
        onLoad={onLoad}
        onError={onError}
      />
      
      {hasError && (
        <div className="absolute bottom-4 left-4 right-4 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-600">
          Certaines images n'ont pas pu être chargées et ont été remplacées par des images par défaut.
        </div>
      )}
    </div>
  );
};
