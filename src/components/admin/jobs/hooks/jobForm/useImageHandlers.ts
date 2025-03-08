
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
  
  // Fonction améliorée pour stocker les images de manière ultra-persistante
  const storeImagesInLocalStorage = (key: string, imageUrl: string | string[]) => {
    try {
      if (Array.isArray(imageUrl)) {
        // Stockage principal
        localStorage.setItem(key, JSON.stringify(imageUrl));
        // Stockage de sauvegarde avec horodatage
        localStorage.setItem(`${key}_${Date.now()}`, JSON.stringify(imageUrl));
        
        // Stockage individuel pour une récupération avancée
        imageUrl.forEach((url, idx) => {
          localStorage.setItem(`${key}_item_${Date.now()}_${idx}`, url);
        });
        
        // Stockage sessionStorage pour la session en cours
        sessionStorage.setItem(key, JSON.stringify(imageUrl));
      } else {
        // Pour une seule image
        const existingImages = localStorage.getItem(key);
        const imagesArray = existingImages ? JSON.parse(existingImages) : [];
        imagesArray.push(imageUrl);
        
        // Stockage principal
        localStorage.setItem(key, JSON.stringify(imagesArray));
        // Stockage de sauvegarde
        localStorage.setItem(`${key}_${Date.now()}`, JSON.stringify(imagesArray));
        // Stockage individuel
        localStorage.setItem(`${key}_item_${Date.now()}`, imageUrl);
        
        // Stockage sessionStorage
        sessionStorage.setItem(key, JSON.stringify(imagesArray));
      }
      console.log(`Images stockées dans plusieurs couches de persistance pour la clé ${key}`);
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
      
      // Stockage additionnel avec horodatage précis
      const backupKey = `${storageKey}_backup_${new Date().toISOString()}`;
      localStorage.setItem(backupKey, imageUrl);
    }, 1500);
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = (isHousingOffer: boolean) => {
    simulateImageUpload((url) => {
      setFeaturedImage(url);
      
      // Store featured image for persistence avec multiples sauvegardes
      localStorage.setItem('job_featured_image', url);
      localStorage.setItem(`job_featured_image_${Date.now()}`, url);
      sessionStorage.setItem('job_featured_image', url);
      
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
    
    // Update stored images with multiple layers
    storeImagesInLocalStorage('job_images', newImages);
    
    toast.success("Image supprimée");
  };

  return {
    handleFeaturedImageUpload,
    handleAddImage,
    handleRemoveImage
  };
};
