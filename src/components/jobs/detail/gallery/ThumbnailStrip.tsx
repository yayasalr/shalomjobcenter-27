
import React from 'react';
import { getDomainImage } from '../../utils/jobUtils';

interface ThumbnailStripProps {
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  domain: string;
}

export const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({
  images,
  currentIndex,
  setCurrentIndex,
  setIsLoading,
  domain,
}) => {
  if (images.length <= 1) return null;
  
  return (
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/20 overflow-x-auto">
      <div className="flex gap-2">
        {images.map((image, index) => (
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
                e.currentTarget.src = getDomainImage(domain);
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
