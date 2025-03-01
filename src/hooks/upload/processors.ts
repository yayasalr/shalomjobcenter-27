
/**
 * Utility functions for processing images
 */

/**
 * Compress an image file to reduce file size
 * @param file Original image file
 * @param maxWidth Maximum width in pixels
 * @param maxHeight Maximum height in pixels 
 * @param quality Compression quality (0-1)
 * @returns Promise with compressed File
 */
export const compressImage = (
  file: File, 
  maxWidth: number = 1200, 
  maxHeight: number = 1200, 
  quality: number = 0.75
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }
        
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw image to canvas with new dimensions
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with reduced quality
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }
          
          // Create new file with compressed data
          const compressedFile = new File(
            [blob],
            file.name,
            {
              type: file.type,
              lastModified: Date.now()
            }
          );
          
          resolve(compressedFile);
        }, file.type, quality);
      };
      
      img.onerror = () => {
        reject(new Error('Image loading failed'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };
  });
};

/**
 * Clean up blob URLs to prevent memory leaks
 * @param urls Array of image URLs to clean up
 */
export const cleanupImageUrls = (urls: string[]): void => {
  if (!urls || !Array.isArray(urls)) return;
  
  urls.forEach(url => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
};

/**
 * Process an array of files, compressing them and generating preview URLs
 * @param files Array of files to process
 * @param maxWidth Maximum width for compression
 * @param maxHeight Maximum height for compression
 * @param quality Quality factor for compression (0-1)
 * @param progressCallback Optional callback for progress updates
 * @returns Promise with array of preview URLs
 */
export const processFiles = async (
  files: File[],
  maxWidth: number,
  maxHeight: number,
  quality: number,
  progressCallback?: (progress: number) => void
): Promise<string[]> => {
  const newPreviews: string[] = [];
  const totalFiles = files.length;
  let processedCount = 0;
  
  for (const file of files) {
    try {
      // Compress the image
      const compressedFile = await compressImage(file, maxWidth, maxHeight, quality);
      
      // Create blob URL for preview
      const previewUrl = URL.createObjectURL(compressedFile);
      newPreviews.push(previewUrl);
      
      // Update progress
      processedCount++;
      if (progressCallback) {
        progressCallback(Math.round((processedCount / totalFiles) * 100));
      }
    } catch (error) {
      console.error("Error processing image:", error);
      // Continue with other files even if one fails
    }
  }
  
  return newPreviews;
};
