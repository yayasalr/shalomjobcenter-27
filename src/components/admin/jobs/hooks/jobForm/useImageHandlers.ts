
import { toast } from "sonner";
import useLocalStorage from "@/hooks/useLocalStorage";
import { convertBlobToBase64 } from "@/hooks/useJobs/jobImageUtils";

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
  
  // Fonction pour stocker les images dans localStorage avec conversion blob→base64
  const storeImagesInLocalStorage = async (key: string, imageUrl: string | string[]) => {
    try {
      const timestamp = Date.now();
      
      if (Array.isArray(imageUrl)) {
        // Convertir chaque URL blob en base64
        const base64Images = await Promise.all(
          imageUrl.map(async (url) => {
            if (url.startsWith('blob:')) {
              return await convertBlobToBase64(url);
            }
            return url;
          })
        );
        
        // Filtrer les images vides ou invalides
        const validImages = base64Images.filter(img => img && img.length > 0);
        
        // Stockage avec horodatage et multiples sauvegardes
        const timestampedKey = `${key}_${timestamp}`;
        setItem(timestampedKey, validImages);
        
        // Stocker le timestamp comme référence
        setItem(`${key}_latest_timestamp`, timestamp.toString());
        setItem(`${key}_latest`, validImages);
        
        console.log(`Images converties et stockées avec timestamp ${timestamp}:`, validImages.length);
      } else {
        // Pour une seule image
        let base64Image = imageUrl;
        if (imageUrl.startsWith('blob:')) {
          base64Image = await convertBlobToBase64(imageUrl);
        }
        
        const timestampedKey = `${key}_${timestamp}`;
        setItem(timestampedKey, base64Image);
        setItem(`${key}_latest_timestamp`, timestamp.toString());
        setItem(`${key}_latest`, base64Image);
        
        console.log(`Image convertie et stockée avec timestamp ${timestamp}`);
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
      reader.onloadend = () => {
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
          
          console.log(`Image principale téléchargée et stockée`);
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
          
          console.log(`Images additionnelles mises à jour et stockées: ${updatedImages.length}`);
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
    
    console.log(`Images mise à jour après suppression: ${newImages.length}`);
    
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
