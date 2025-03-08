
// Utilitaires pour valider les formats d'images et d'URLs

/**
 * Vérifie si une URL est au format base64
 */
export const isBase64Image = (url: string): boolean => {
  return url && typeof url === 'string' && url.startsWith('data:image/');
};

/**
 * Vérifie si une URL est au format http/https
 */
export const isValidHttpUrl = (url: string): boolean => {
  try {
    return url && typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
  } catch {
    return false;
  }
};

/**
 * Vérifie si une URL est au format blob
 */
export const isBlobUrl = (url: string): boolean => {
  return url && typeof url === 'string' && url.startsWith('blob:');
};
