
import { useState } from 'react';
import { toast } from "sonner";
import useLocalStorage from "@/hooks/useLocalStorage";
import { convertBlobToBase64 } from "@/hooks/useJobs/utils/imageConversion";
import { compressImage } from "@/utils/imageProcessing";
import { 
  storeImagesToLocalStorage, 
  storeSingleImageToLocalStorage,
  clearTemporaryImages
} from "@/utils/imageStorage";

export interface UseImageHandlersParams {
  images: string[];
  setImages: (value: string[]) => void;
  setFeaturedImage: (value: string) => void;
  setIsUploading: (value: boolean) => void;
}

/**
 * Validation de l'image téléchargée
 */
const validateImage = (file: File, maxSizeMB = 2): boolean => {
  if (file.size > maxSizeMB * 1024 * 1024) {
    toast.error(`L'image est trop volumineuse (max ${maxSizeMB}Mo)`);
    return false;
  }
  return true;
};

/**
 * Télécharge et traite un fichier image
 */
const uploadAndProcessImage = (
  file: File, 
  callback: (url: string) => void,
  setIsUploading: (value: boolean) => void
): void => {
  setIsUploading(true);
  
  try {
    if (!validateImage(file)) {
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

/**
 * Crée un input de type file et déclenche la sélection de fichier
 */
const createFileInput = (
  onFileSelected: (files: FileList | null) => void,
  acceptTypes = 'image/*'
): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = acceptTypes;
  
  input.onchange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    onFileSelected(files);
  };
  
  input.click();
};

export const useImageHandlers = ({
  images,
  setImages,
  setFeaturedImage,
  setIsUploading
}: UseImageHandlersParams) => {

  // Gère le téléchargement d'image principale
  const handleFeaturedImageUpload = () => {
    createFileInput((files) => {
      if (files && files.length > 0) {
        const file = files[0];
        uploadAndProcessImage(file, async (url) => {
          setFeaturedImage(url);
          
          // Stocker dans localStorage compressé
          try {
            let base64Image = url;
            if (url.startsWith('blob:')) {
              base64Image = await convertBlobToBase64(url);
            }
            
            await storeSingleImageToLocalStorage(
              'job_featured_image', 
              base64Image,
              compressImage
            );
          } catch (error) {
            console.error("Erreur lors du traitement de l'image:", error);
          }
        }, setIsUploading);
      }
    });
  };

  // Gère l'ajout d'une image additionnelle
  const handleAddImage = () => {
    // Limiter le nombre d'images à 3
    if (images.length >= 3) {
      toast.warning("Maximum 3 images autorisées pour éviter les problèmes de stockage");
      return;
    }
    
    createFileInput((files) => {
      if (files && files.length > 0) {
        const file = files[0];
        uploadAndProcessImage(file, async (url) => {
          const updatedImages = [...images, url];
          setImages(updatedImages);
          
          // Traiter et stocker les images
          try {
            const processedImages = await Promise.all(
              updatedImages.map(async (img) => {
                let base64Img = img;
                if (img.startsWith('blob:')) {
                  base64Img = await convertBlobToBase64(img);
                }
                return base64Img;
              })
            );
            
            // Stocker dans localStorage
            await storeImagesToLocalStorage(
              'job_images', 
              processedImages,
              compressImage
            );
          } catch (error) {
            console.error("Erreur lors du traitement des images:", error);
          }
        }, setIsUploading);
      }
    });
  };

  // Supprime une image à un index spécifique
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Mettre à jour localStorage
    storeImagesToLocalStorage('job_images', newImages, compressImage);
    toast.success("Image supprimée");
  };

  // Supprime toutes les images
  const handleClearAllImages = () => {
    setImages([]);
    clearTemporaryImages();
    toast.success("Toutes les images ont été supprimées");
  };

  return {
    handleFeaturedImageUpload,
    handleAddImage,
    handleRemoveImage,
    handleClearAllImages
  };
};
