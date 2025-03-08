
// Fichier principal d'export pour maintenir la compatibilité avec le code existant
import { convertBlobToBase64 } from './utils/imageConversion';
import { isBase64Image, isValidHttpUrl, isBlobUrl } from './utils/imageValidation';
import { saveJobImages, clearJobImages, purgeAllJobImages } from './utils/imageStorage';
import { processStoredImages } from './utils/imageProcessing';

// Re-export des fonctions pour maintenir la compatibilité avec le code existant
export {
  convertBlobToBase64,
  isBase64Image,
  isValidHttpUrl,
  isBlobUrl,
  saveJobImages,
  clearJobImages,
  purgeAllJobImages,
  processStoredImages
};
