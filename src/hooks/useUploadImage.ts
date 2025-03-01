
// This file is now a simple re-export file for backward compatibility
import { useUploadImage } from './upload';
export { useUploadImage };
export * from './upload/types';
export { compressImage, cleanupImageUrls } from './upload/processors';

