
/**
 * Utilitaires pour convertir les formats d'images
 */

/**
 * Convertit une URL blob en base64
 */
export const convertBlobToBase64 = async (blobUrl: string): Promise<string> => {
  if (!blobUrl || !blobUrl.startsWith('blob:')) {
    return blobUrl; // Retourner tel quel si ce n'est pas une URL blob
  }
  
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => {
        console.error('Error converting blob to base64');
        reject(new Error('Failed to convert blob to base64'));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching blob URL:', error);
    return "https://source.unsplash.com/random/800x600/?work"; // Image par défaut
  }
};
