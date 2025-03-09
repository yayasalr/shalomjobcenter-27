import React from 'react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div key={index} className="image-item">
          <img src={image} alt={`Gallery image ${index + 1}`} className="gallery-image" />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
