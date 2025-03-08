
import React from 'react';
import { ChevronLeft, ChevronRight, Maximize, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryControlsProps {
  isFullScreen: boolean;
  handlePrevious: () => void;
  handleNext: () => void;
  toggleFullScreen: () => void;
  totalImages: number;
  currentIndex: number;
}

export const GalleryControls: React.FC<GalleryControlsProps> = ({
  isFullScreen,
  handlePrevious,
  handleNext,
  toggleFullScreen,
  totalImages,
  currentIndex,
}) => {
  return (
    <>
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
          {currentIndex + 1} / {totalImages}
        </div>
      </div>
    </>
  );
};
