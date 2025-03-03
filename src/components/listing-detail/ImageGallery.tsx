
import React, { useEffect, useRef } from "react";
import { MagicBook } from "@/components/ui/magic-book";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const hasMultipleImages = images.length > 1;

  return (
    <div 
      ref={galleryRef}
      className="relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-[2/1] w-full mx-auto mb-8 bg-gray-200"
    >
      {images.length > 0 ? (
        hasMultipleImages ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
            {/* Main image */}
            <div className="relative col-span-1 row-span-1 md:row-span-2 h-full">
              <img
                src={images[0]}
                alt={`${alt} - Image principale`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
                }}
              />
            </div>

            {/* Secondary images - only show on larger screens */}
            <div className="hidden md:grid md:grid-rows-2 gap-2 h-full">
              {images.slice(1, 3).map((image, index) => (
                <div key={index} className="relative w-full h-full">
                  <img
                    src={image}
                    alt={`${alt} - Image ${index + 2}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Single image
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
            }}
          />
        )
      ) : (
        // Fallback if no images
        <div className="flex items-center justify-center h-full bg-gray-200">
          <span className="text-gray-400">Aucune image disponible</span>
        </div>
      )}
      
      {/* Add the magic book */}
      <MagicBook 
        position="bottom-left" 
        className="opacity-90 hover:opacity-100"
      />
    </div>
  );
};

export default ImageGallery;
