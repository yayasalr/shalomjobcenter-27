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
  
  // Fonction pour compresser une image avant stockage
  const compressImage = (base64Image: string, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Resize if needed
          const maxWidth = 1000;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = base64Image;
      } catch (error) {
        reject(error);
      }
    });
  };
  
  // Fonction pour stocker les images dans localStorage avec conversion blob→base64
  // Nous n'utiliserons plus les clés "latest" pour éviter les mélanges entre offres
  const storeImagesInLocalStorage = async (key: string, imageUrl: string | string[], jobId?: string) => {
    try {
      // Purger les anciennes entrées pour libérer de l'espace
      purgeOldEntries();
      
      // Si nous avons un jobId, utiliser des clés spécifiques à ce job
      // Sinon, utiliser temporairement les clés "latest" (uniquement lors de la création)
      const storageKey = jobId ? `${key}_${jobId}` : `${key}_latest`;
      
      if (Array.isArray(imageUrl)) {
        // Limiter à max 3 images pour éviter de dépasser le quota
        const limitedImages = imageUrl.slice(0, 3);
        
        // Convertir chaque URL blob en base64 et compresser
        const base64Images = await Promise.all(
          limitedImages.map(async (url) => {
            try {
              let base64 = url;
              if (url.startsWith('blob:')) {
                base64 = await convertBlobToBase64(url);
              }
              return await compressImage(base64, 0.6);
            } catch (error) {
              console.error("Erreur lors du traitement de l'image:", error);
              return '';
            }
          })
        );
        
        // Filtrer les images vides ou invalides
        const validImages = base64Images.filter(img => img && img.length > 0);
        
        if (validImages.length > 0) {
          setItem(storageKey, validImages);
          console.log(`${validImages.length} images converties et stockées dans ${storageKey}`);
        }
      } else {
        // Pour une seule image
        try {
          let base64Image = imageUrl;
          if (imageUrl.startsWith('blob:')) {
            base64Image = await convertBlobToBase64(imageUrl);
          }
          
          // Compresser l'image
          const compressedImage = await compressImage(base64Image, 0.7);
          
          setItem(storageKey, compressedImage);
          console.log(`Image convertie et stockée dans ${storageKey}`);
        } catch (error) {
          console.error("Erreur lors du traitement de l'image:", error);
        }
      }
    } catch (error) {
      console.error('Erreur lors du stockage des images:', error);
    }
  };
  
  // Fonction pour supprimer les anciennes entrées du localStorage
  const purgeOldEntries = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('job_featured_image_') || key.includes('job_images_'))) {
          // Ne supprimer que les anciennes entrées (pas les "latest")
          if (!key.includes('_latest')) {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage du localStorage:', error);
    }
  };
  
  // Fonction pour télécharger l'image fournie par l'utilisateur
  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    setIsUploading(true);
    
    try {
      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image est trop volumineuse (max 2Mo)");
        setIsUploading(false);
        return;
      }
      
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
          
          // Stocker dans localStorage compressé
          // Mais uniquement temporairement avec la clé "latest"
          try {
            let base64Image = url;
            if (url.startsWith('blob:')) {
              base64Image = await convertBlobToBase64(url);
            }
            const compressedImage = await compressImage(base64Image, 0.7);
            setItem('job_featured_image_latest', compressedImage);
            console.log(`Image principale téléchargée et stockée temporairement`);
          } catch (error) {
            console.error("Erreur lors du traitement de l'image:", error);
          }
        });
      }
    };
    
    input.click();
  };

  // Fonction pour gérer les images additionnelles
  const handleAddImage = (isHousingOffer: boolean) => {
    // Limiter le nombre d'images à 3 pour éviter les problèmes de quota
    if (images.length >= 3) {
      toast.warning("Maximum 3 images autorisées pour éviter les problèmes de stockage");
      return;
    }
    
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
          
          // Stocker dans localStorage, version compressée
          // Mais uniquement temporairement avec la clé "latest"
          await storeImagesInLocalStorage('job_images', updatedImages);
        });
      }
    };
    
    input.click();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Mettre à jour localStorage
    storeImagesInLocalStorage('job_images', newImages);
    
    toast.success("Image supprimée");
  };

  const handleClearAllImages = () => {
    setImages([]);
    
    // Nettoyer le localStorage pour cette entrée spécifique
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
