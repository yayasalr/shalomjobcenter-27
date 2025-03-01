
/**
 * Types for the image upload functionality
 */

// Options for configuring the image upload hook
export interface UseUploadImageOptions {
  maxFileSize?: number; // in MB
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}

// Return value from the image upload hook
export interface UseUploadImageReturn {
  imagePreviews: string[];
  uploading: boolean;
  uploadProgress: number;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSingleImageUpload: (file: File) => Promise<{
    originalFile: File;
    compressedFile: File;
    previewUrl: string;
  } | null>;
  removeImage: (index: number) => void;
  clearImages: () => void;
  cleanupPreviews: () => void;
}

// Result of a single image upload
export interface SingleUploadResult {
  originalFile: File;
  compressedFile: File;
  previewUrl: string;
}
