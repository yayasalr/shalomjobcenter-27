
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
  const { setItem, getItem } = useLocalStorage();
  
  // Fonction pour convertir une URL blob en base64
  const convertBlobToBase64 = async (blobUrl: string): Promise<string> => {
    try {
      // Si c'est déjà une URL http/https ou une donnée base64, la retourner telle quelle
      if (!blobUrl.startsWith('blob:')) {
        return blobUrl;
      }
      
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erreur lors de la conversion blob vers base64:', error);
      return blobUrl; // En cas d'erreur, retourner l'URL originale
    }
  };
  
  // Fonction améliorée pour garantir une persistance des images
  const storeImagesInLocalStorage = async (key: string, imageUrl: string | string[]) => {
    try {
      const timestamp = Date.now();
      
      if (Array.isArray(imageUrl)) {
        // Convertir chaque URL blob en base64
        const base64Images = await Promise.all(
          imageUrl.map(url => convertBlobToBase64(url))
        );
        
        // Stockage avec horodatage et multiples sauvegardes
        const timestampedKey = `${key}_${timestamp}`;
        setItem(timestampedKey, base64Images);
        
        // Stocker le timestamp comme référence
        setItem(`${key}_latest_timestamp`, timestamp.toString());
        setItem(`${key}_latest`, base64Images);
        
        console.log(`Images converties et stockées avec timestamp ${timestamp}:`, base64Images);
      } else {
        // Pour une seule image
        const base64Image = await convertBlobToBase64(imageUrl);
        const timestampedKey = `${key}_${timestamp}`;
        const imageArray = [base64Image];
        setItem(timestampedKey, imageArray);
        setItem(`${key}_latest_timestamp`, timestamp.toString());
        setItem(`${key}_single_${timestamp}`, base64Image);
        setItem(`${key}_latest`, base64Image);
        
        console.log(`Image convertie et stockée avec timestamp ${timestamp}:`, base64Image);
      }
    } catch (error) {
      console.error('Erreur lors du stockage des images:', error);
    }
  };
  
  // Fonction pour télécharger l'image fournie par l'utilisateur
  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const baseUrl = reader.result as string;
        callback(baseUrl);
        setIsUploading(false);
        toast.success("Image téléchargée avec succès");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Erreur lors du téléchargement de l'image");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      setIsUploading(false);
      toast.error("Erreur lors du téléchargement de l'image");
    }
  };

  // Simuler téléchargement d'image avec URLs persistantes
  const simulateImageUpload = async (callback: (url: string) => void, isHousingOffer: boolean) => {
    setIsUploading(true);
    
    try {
      // Générer image aléatoire d'Unsplash ou utiliser une image locale
      const timestamp = Date.now();
      const randomId = Math.floor(Math.random() * 10000);
      
      // Générer URL d'image aléatoire cohérente
      const category = isHousingOffer ? 'apartment,house' : 'office,work';
      const imageUrl = `https://source.unsplash.com/random/800x600/?${category}&sig=${timestamp}-${randomId}`;
      
      // Simuler délai de téléchargement
      setTimeout(async () => {
        // Sauvegarde directement en URL http, pas besoin de conversion
        callback(imageUrl);
        setIsUploading(false);
        
        // Persister dans localStorage
        const storageKey = isHousingOffer ? 'job_housing_images' : 'job_images';
        await storeImagesInLocalStorage(storageKey, imageUrl);
        
        console.log(`Image téléchargée et stockée comme URL permanente: ${imageUrl}`);
      }, 1500);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      setIsUploading(false);
      toast.error("Erreur lors du téléchargement de l'image");
    }
  };

  // Gérer le téléchargement d'image principale
  const handleFeaturedImageUpload = (isHousingOffer: boolean) => {
    // Document Input pour téléchargement d'image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        handleImageUpload(file, async (url) => {
          setFeaturedImage(url);
          
          // Stockage avec horodatage précis
          const timestamp = Date.now();
          setItem(`job_featured_image_${timestamp}`, url);
          setItem('job_featured_image_latest_timestamp', timestamp.toString());
          setItem('job_featured_image_latest', url);
          
          console.log(`Image principale téléchargée et stockée: ${url}`);
        });
      }
    };
    
    input.click();
  };

  // Fonction pour gérer les images additionnelles
  const handleAddImage = (isHousingOffer: boolean) => {
    // Document Input pour téléchargement d'image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        handleImageUpload(file, async (url) => {
          const updatedImages = [...images, url];
          setImages(updatedImages);
          
          // Stockage avec horodatage précis
          const timestamp = Date.now();
          setItem(`job_images_${timestamp}`, updatedImages);
          setItem('job_images_latest_timestamp', timestamp.toString());
          setItem('job_images_latest', updatedImages);
          
          console.log(`Images additionnelles mises à jour et stockées: ${JSON.stringify(updatedImages)}`);
        });
      }
    };
    
    input.click();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Stockage avec horodatage précis après suppression
    const timestamp = Date.now();
    setItem(`job_images_${timestamp}`, newImages);
    setItem('job_images_latest_timestamp', timestamp.toString());
    setItem('job_images_latest', newImages);
    
    console.log(`Images mise à jour après suppression: ${JSON.stringify(newImages)}`);
    
    toast.success("Image supprimée");
  };

  const handleClearAllImages = () => {
    setImages([]);
    
    // Nettoyer le localStorage
    const timestamp = Date.now();
    setItem(`job_images_${timestamp}`, []);
    setItem('job_images_latest_timestamp', timestamp.toString());
    setItem('job_images_latest', []);
    
    toast.success("Toutes les images ont été supprimées");
  };

  return {
    handleFeaturedImageUpload,
    handleAddImage,
    handleRemoveImage,
    handleClearAllImages
  };
};
