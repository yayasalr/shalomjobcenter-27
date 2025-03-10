
import React from 'react';
import { Job } from '@/types/job';
import { GalleryControls } from './gallery/GalleryControls';
import { ThumbnailStrip } from './gallery/ThumbnailStrip';
import { GalleryImage } from './gallery/GalleryImage';
import { EmptyGalleryState } from './gallery/EmptyGalleryState';
import { useGallery } from './gallery/useGallery';

interface JobGalleryProps {
  job: Job;
  className?: string;
}

export const JobGallery: React.FC<JobGalleryProps> = ({ job, className }) => {
  const {
    currentIndex,
    setCurrentIndex,
    isFullScreen,
    isLoading,
    setIsLoading,
    galleryImages,
    hasError,
    domain,
    handlePrevious,
    handleNext,
    toggleFullScreen,
    handleImageLoad,
    handleImageError
  } = useGallery(job);

  if (galleryImages.length === 0) {
    return <EmptyGalleryState className={className} />;
  }

  return (
    <div 
      className={`${className} relative overflow-hidden rounded-xl ${
        isFullScreen ? 'fixed inset-0 z-50 bg-black' : ''
      }`}
    >
      {/* Main Gallery Image */}
      <GalleryImage 
        src={galleryImages[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        isFullScreen={isFullScreen}
        isLoading={isLoading}
        onLoad={handleImageLoad}
        onError={() => handleImageError(currentIndex)}
        hasError={hasError}
        domain={domain}
      />

      {/* Navigation and Control Elements */}
      <GalleryControls 
        isFullScreen={isFullScreen}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        toggleFullScreen={toggleFullScreen}
        totalImages={galleryImages.length}
        currentIndex={currentIndex}
      />

      {/* Thumbnail Strip */}
      <ThumbnailStrip 
        images={galleryImages}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        setIsLoading={setIsLoading}
        domain={job.domain}
      />
    </div>
  );
};
