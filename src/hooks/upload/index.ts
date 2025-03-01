
import { useState } from 'react';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { 
  UseUploadImageOptions, 
  UseUploadImageReturn,
  SingleUploadResult 
} from './types';
import { validateFiles, validateSingleFile } from './validators';
import { compressImage, cleanupImageUrls, processFiles } from './processors';

/**
 * Hook for handling image uploads with preview, compression and validation
 */
export const useUploadImage = ({
  maxFileSize = 5, // Default 5MB
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFiles = 10
}: UseUploadImageOptions = {}): UseUploadImageReturn => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast: showToast } = useToast();

  // Cleanup function to prevent memory leaks with blob URLs
  const cleanupPreviews = () => {
    cleanupImageUrls(imagePreviews);
  };

  // Handle file selection from <input type="file">
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const files = Array.from(e.target.files);
      
      // Validate the files
      const validationResult = validateFiles(files, allowedTypes, maxFileSize, maxFiles);
      if (!validationResult.valid) {
        setUploading(false);
        return;
      }
      
      // Process the files
      const newPreviews = await processFiles(
        files,
        maxWidth,
        maxHeight,
        quality,
        (progress) => setUploadProgress(progress)
      );
      
      if (newPreviews.length > 0) {
        setImagePreviews(prev => [...prev, ...newPreviews]);
        showToast({
          title: "Images téléchargées",
          description: `${newPreviews.length} sur ${files.length} images ont été traitées avec succès`,
        });
      } else {
        showToast({
          variant: "destructive",
          title: "Échec du téléchargement",
          description: "Aucune image n'a pu être traitée",
        });
      }
    } catch (error) {
      console.error("Error processing images:", error);
      showToast({
        variant: "destructive",
        title: "Erreur de téléchargement",
        description: "Une erreur s'est produite lors du traitement des images",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      
      // Reset the input value to allow selecting the same files again
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Handle single file upload from the modular components
  const handleSingleImageUpload = async (file: File): Promise<SingleUploadResult | null> => {
    setUploading(true);
    
    try {
      // Validate the file
      const validation = validateSingleFile(file, allowedTypes, maxFileSize);
      if (!validation.valid) {
        toast.error(validation.errorMessage);
        setUploading(false);
        return null;
      }
      
      // Compress the image
      const compressedFile = await compressImage(
        file,
        maxWidth,
        maxHeight,
        quality
      );
      
      // Create blob URL for preview
      const previewUrl = URL.createObjectURL(compressedFile);
      
      // Add to previews
      setImagePreviews(prev => [...prev, previewUrl]);
      
      showToast({
        title: "Image téléchargée",
        description: "L'image a été traitée avec succès",
      });
      
      return {
        originalFile: file,
        compressedFile,
        previewUrl
      };
    } catch (error) {
      console.error("Error processing image:", error);
      showToast({
        variant: "destructive",
        title: "Échec du téléchargement",
        description: "L'image n'a pas pu être traitée",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    // Revoke the blob URL to prevent memory leaks
    const urlToRemove = imagePreviews[index];
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    // Clean up all blob URLs before clearing
    cleanupPreviews();
    setImagePreviews([]);
  };

  // Clean up on unmount
  useState(() => {
    return () => {
      cleanupPreviews();
    };
  });

  return {
    imagePreviews,
    uploading,
    uploadProgress,
    handleImageChange,
    handleSingleImageUpload,
    removeImage,
    clearImages,
    cleanupPreviews
  };
};

// Re-export types for easier imports
export * from './types';
export { compressImage, cleanupImageUrls } from './processors';

