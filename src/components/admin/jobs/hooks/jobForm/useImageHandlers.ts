
import { toast } from "sonner";
import useLocalStorage from "@/hooks/useLocalStorage";

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
  const localStorage = useLocalStorage();
  
  // Fonction améliorée pour garantir une persistance des images
  const storeImagesInLocalStorage = (key: string, imageUrl: string | string[]) => {
    try {
      const timestamp = Date.now();
      
      if (Array.isArray(imageUrl)) {
        // Stockage avec horodatage et multiples sauvegardes
        const timestampedKey = `${key}_${timestamp}`;
        localStorage.setItem(timestampedKey, imageUrl);
        
        // Stocker le timestamp comme référence
        localStorage.setItem(`${key}_latest_timestamp`, timestamp.toString());
        localStorage.setItem(`${key}_latest`, imageUrl);
        
        console.log(`Images stockées avec timestamp ${timestamp}:`, imageUrl);
      } else {
        // Pour une seule image
        const timestampedKey = `${key}_${timestamp}`;
        localStorage.setItem(timestampedKey, [imageUrl]);
        localStorage.setItem(`${key}_latest_timestamp`, timestamp.toString());
        localStorage.setItem(`${key}_single_${timestamp}`, imageUrl);
        localStorage.setItem(`${key}_latest`, [imageUrl]);
        
        console.log(`Image stockée avec timestamp ${timestamp}:`, imageUrl);
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
      
      // Persist to localStorage with enhanced persistence
      const storageKey = isHousingOffer ? 'job_housing_images' : 'job_images';
      storeImagesInLocalStorage(storageKey, imageUrl);
      
      console.log(`Image téléchargée et stockée: ${imageUrl}`);
    }, 1500);
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = (isHousingOffer: boolean) => {
    simulateImageUpload((url) => {
      setFeaturedImage(url);
      
      // Stockage avec horodatage précis
      const timestamp = Date.now();
      localStorage.setItem(`job_featured_image_${timestamp}`, url);
      localStorage.setItem('job_featured_image_latest_timestamp', timestamp.toString());
      localStorage.setItem('job_featured_image_latest', url);
      
      console.log(`Image principale téléchargée et stockée: ${url}`);
      
      toast.success("Image principale téléchargée avec succès");
    }, isHousingOffer);
  };

  // Fonctions pour gérer les images additionnelles
  const handleAddImage = (isHousingOffer: boolean) => {
    simulateImageUpload((url) => {
      const updatedImages = [...images, url];
      setImages(updatedImages);
      
      // Stockage avec horodatage précis
      const timestamp = Date.now();
      localStorage.setItem(`job_images_${timestamp}`, JSON.stringify(updatedImages));
      localStorage.setItem('job_images_latest_timestamp', timestamp.toString());
      localStorage.setItem('job_images_latest', JSON.stringify(updatedImages));
      
      console.log(`Images additionnelles mises à jour et stockées: ${JSON.stringify(updatedImages)}`);
      
      toast.success("Nouvelle image ajoutée");
    }, isHousingOffer);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Stockage avec horodatage précis après suppression
    const timestamp = Date.now();
    localStorage.setItem(`job_images_${timestamp}`, JSON.stringify(newImages));
    localStorage.setItem('job_images_latest_timestamp', timestamp.toString());
    localStorage.setItem('job_images_latest', JSON.stringify(newImages));
    
    console.log(`Images mise à jour après suppression: ${JSON.stringify(newImages)}`);
    
    toast.success("Image supprimée");
  };

  return {
    handleFeaturedImageUpload,
    handleAddImage,
    handleRemoveImage
  };
};
