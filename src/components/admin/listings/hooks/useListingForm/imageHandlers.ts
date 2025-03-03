
import { useState } from "react";

/**
 * Manages image uploads and previews
 */
export const useImageHandlers = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const resetImages = () => {
    // Clean up URL objects to prevent memory leaks
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setImagePreviews([]);
  };

  const loadImagesFromListing = (listing: any) => {
    setImages([]);
    
    if (listing.images && listing.images.length > 0) {
      setImagePreviews(listing.images.filter((img: string) => !img.startsWith('blob:')));
    } else if (listing.image && !listing.image.startsWith('blob:')) {
      setImagePreviews([listing.image]);
    } else {
      setImagePreviews([]);
    }
  };

  return {
    images,
    imagePreviews,
    handleImageChange,
    removeImage,
    resetImages,
    loadImagesFromListing
  };
};
