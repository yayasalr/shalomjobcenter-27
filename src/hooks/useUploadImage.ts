
import { useState } from 'react';
import { toast } from 'sonner';
import { compressImage, cleanupImageUrls } from '@/utils/imageUtils';
import { useToast } from './use-toast';

interface UseUploadImageOptions {
  maxFileSize?: number; // in MB
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}

export const useUploadImage = ({
  maxFileSize = 5, // Default 5MB
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFiles = 10
}: UseUploadImageOptions = {}) => {
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
      
      // Check if too many files are selected
      if (maxFiles && files.length > maxFiles) {
        toast.error(`Vous ne pouvez pas télécharger plus de ${maxFiles} images à la fois`);
        setUploading(false);
        return;
      }
      
      // Check file types
      const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
      if (invalidFiles.length > 0) {
        toast.error(`Formats acceptés: ${allowedTypes.map(type => type.replace('image/', '.')).join(', ')}`);
        setUploading(false);
        return;
      }
      
      // Check file sizes
      const oversizedFiles = files.filter(file => file.size > maxFileSize * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error(`Les images ne doivent pas dépasser ${maxFileSize}MB`);
        setUploading(false);
        return;
      }
      
      // Process valid files with compression
      const newPreviews: string[] = [];
      const totalFiles = files.length;
      let processedCount = 0;
      
      for (const file of files) {
        try {
          // Compress the image
          const compressedFile = await compressImage(
            file,
            maxWidth,
            maxHeight,
            quality
          );
          
          // Create blob URL for preview
          const previewUrl = URL.createObjectURL(compressedFile);
          newPreviews.push(previewUrl);
          
          // Update progress
          processedCount++;
          setUploadProgress(Math.round((processedCount / totalFiles) * 100));
          
        } catch (error) {
          console.error("Error processing image:", error);
          // Continue with other files even if one fails
        }
      }
      
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
  const handleSingleImageUpload = async (file: File) => {
    setUploading(true);
    
    try {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Format non supporté. Formats acceptés: ${allowedTypes.map(type => type.replace('image/', '.')).join(', ')}`);
        setUploading(false);
        return;
      }
      
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(`L'image ne doit pas dépasser ${maxFileSize}MB`);
        setUploading(false);
        return;
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
