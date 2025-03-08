
import { toast } from "sonner";

export interface UseImageHandlersParams {
  images: string[];
  setImages: (value: string[]) => void;
  setFeaturedImage: (value: string) => void;
  setIsUploading: (value: boolean) => void;
}

export const useImageHandlers = ({
  images,
  setImages,
  setFeaturedImage,
  setIsUploading
}: UseImageHandlersParams) => {
  
  // Fonction pour stocker les images de manière persistante
  const storeImagesInLocalStorage = (key: string, imageUrl: string | string[]) => {
    try {
      if (Array.isArray(imageUrl)) {
        localStorage.setItem(key, JSON.stringify(imageUrl));
      } else {
        // Pour une seule image
        const existingImages = localStorage.getItem(key);
        const imagesArray = existingImages ? JSON.parse(existingImages) : [];
        imagesArray.push(imageUrl);
        localStorage.setItem(key, JSON.stringify(imagesArray));
      }
    } catch (error) {
      console.error('Erreur lors du stockage des images:', error);
    }
  };
  
  // Simulate image upload with persistent URLs
  const simulateImageUpload = (callback: (url: string) => void, isHousingOffer: boolean) => {
    setIsUploading(true);
    
    // Generate a timestamp to ensure uniqueness
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 10000);
    
    // Generate a random image URL that will be consistent
    const category = isHousingOffer ? 'apartment,house' : 'office,work';
    const imageUrl = `https://source.unsplash.com/random/800x600/?${category}&sig=${timestamp}-${randomId}`;
    
    // Simulate delay for upload
    setTimeout(() => {
      callback(imageUrl);
      setIsUploading(false);
      
      // Persist to localStorage
      if (isHousingOffer) {
        storeImagesInLocalStorage('job_housing_images', imageUrl);
      } else {
        storeImagesInLocalStorage('job_images', imageUrl);
      }
    }, 1500);
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = (isHousingOffer: boolean) => {
    simulateImageUpload((url) => {
      setFeaturedImage(url);
      
      // Store featured image for persistence
      localStorage.setItem('job_featured_image', url);
      
      toast.success("Image principale téléchargée avec succès");
    }, isHousingOffer);
  };

  // Fonctions pour gérer les images
  const handleAddImage = (isHousingOffer: boolean) => {
    simulateImageUpload((url) => {
      const updatedImages = [...images, url];
      setImages(updatedImages);
      
      // Store all images for persistence
      storeImagesInLocalStorage('job_images', updatedImages);
      
      toast.success("Nouvelle image ajoutée");
    }, isHousingOffer);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Update stored images
    storeImagesInLocalStorage('job_images', newImages);
    
    toast.success("Image supprimée");
  };

  return {
    handleFeaturedImageUpload,
    handleAddImage,
    handleRemoveImage
  };
};
