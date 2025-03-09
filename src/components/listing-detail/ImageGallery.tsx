
import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="image-gallery space-y-2">
      {/* Main image */}
      <div className="main-image-container relative rounded-lg overflow-hidden h-[400px]">
        {images.length > 0 ? (
          <img 
            src={images[activeIndex]} 
            alt={`Gallery image ${activeIndex + 1}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="thumbnails-container flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`thumbnail-item cursor-pointer w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                index === activeIndex ? 'border-blue-500 opacity-100' : 'border-transparent opacity-70'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
