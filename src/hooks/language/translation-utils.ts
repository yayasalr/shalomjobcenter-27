
import { SupportedLanguage, TranslationDictionary } from './types';

// Fonction pour obtenir une traduction pour une clé
export const getTranslation = (
  key: string,
  language: SupportedLanguage,
  translations: TranslationDictionary
): string => {
  // Si la clé contient des espaces, c'est probablement déjà un texte en français
  if (key.includes(' ') && key.length > 5) {
    return key;
  }
  
  if (!translations[key]) {
    // Pour le développement, loggons les traductions manquantes
    console.log(`Traduction manquante pour la clé: ${key}`);
    // Transformer la clé en texte lisible
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  return translations[key][language] || key;
};
