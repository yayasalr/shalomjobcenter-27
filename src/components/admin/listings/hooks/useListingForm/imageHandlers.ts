
import { useState, useEffect } from "react";
import { Listing } from "@/types/listing";

export const useImageHandlers = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      console.log("Nouvelles URL de prévisualisation créées:", newPreviews);
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    if (imagePreviews[index]) {
      // Seulement révoquer les URLs blob
      if (imagePreviews[index].startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviews[index]);
      }
    }
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const resetImages = () => {
    // Clean up URL objects to prevent memory leaks
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setImages([]);
    setImagePreviews([]);
  };

  // Nettoyage des URL blob lors du démontage du composant
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  return {
    images,
    imagePreviews,
    handleImageChange,
    removeImage,
    resetImages
  };
};
