
import React from 'react';

interface JobGalleryProps {
  images: string[];
  title: string;
  domain: string;
  getDomainImage: (domain: string) => string;
}

const JobGallery = ({ images, title, domain, getDomainImage }: JobGalleryProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-sholom-dark">Galerie</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div key={index} className="rounded-lg overflow-hidden aspect-square">
            <img 
              src={img || getDomainImage(domain)} 
              alt={`${title} - Image ${index + 1}`} 
              className="w-full h-full object-cover hover-scale transition-transform cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobGallery;
