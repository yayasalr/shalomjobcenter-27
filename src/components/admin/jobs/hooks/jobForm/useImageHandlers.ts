
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
  
  // Simulate image upload with persistent URLs
  const simulateImageUpload = (callback: (url: string) => void, isHousingOffer: boolean) => {
    setIsUploading(true);
    
    // Generate a timestamp to ensure uniqueness
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 10000);
    
    // Generate a random image URL that will be consistent
    // Using a predictable URL pattern to ensure the same image is shown on refresh
    const category = isHousingOffer ? 'apartment,house' : 'office,work';
    const imageUrl = `https://source.unsplash.com/random/800x600/?${category}&sig=${timestamp}-${randomId}`;
    
    // Simulate delay for upload
    setTimeout(() => {
      callback(imageUrl);
      setIsUploading(false);
      
      // Persist images to localStorage for better durability
      if (isHousingOffer) {
        try {
          const storedImages = localStorage.getItem('job_housing_images') || '[]';
          const imagesArray = JSON.parse(storedImages);
          imagesArray.push(imageUrl);
          localStorage.setItem('job_housing_images', JSON.stringify(imagesArray));
        } catch (error) {
          console.error('Error storing image URL:', error);
        }
      }
    }, 1500);
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = (isHousingOffer: boolean) => {
    simulateImageUpload((url) => {
      setFeaturedImage(url);
      
      // Also store the featured image URL for persistence
      try {
        localStorage.setItem('job_featured_image', url);
      } catch (error) {
        console.error('Error storing featured image URL:', error);
      }
      
      toast.success("Image principale téléchargée avec succès");
    }, isHousingOffer);
  };

  // Fonctions pour gérer les images
  const handleAddImage = (isHousingOffer: boolean) => {
    simulateImageUpload((url) => {
      const updatedImages = [...images, url];
      setImages(updatedImages);
      
      // Persist the full array of images
      try {
        localStorage.setItem('job_images', JSON.stringify(updatedImages));
      } catch (error) {
        console.error('Error storing images array:', error);
      }
      
      toast.success("Nouvelle image ajoutée");
    }, isHousingOffer);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Update the stored images array
    try {
      localStorage.setItem('job_images', JSON.stringify(newImages));
    } catch (error) {
      console.error('Error updating stored images array:', error);
    }
    
    toast.success("Image supprimée");
  };

  return {
    handleFeaturedImageUpload,
    handleAddImage,
    handleRemoveImage
  };
};
