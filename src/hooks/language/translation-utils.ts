
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
  
  // Cas spécial pour les phrases qui sont déjà en français
  const frenchPhrases = [
    "Superbe villa avec vue", "Logement de luxe à Lomé", "Villa de luxe",
    "Tokoin, Lomé", "Adakpamé", "Lomé", "Bè", "Tokoin", "Adidogomé",
    "Agoè", "Kodjoviakopé", "Nyékonakpoè", "Hédzranawoé", "Baguida", "Doulassamé",
    "Bas", "Aujourd'hui"
  ];
  
  if (frenchPhrases.includes(key)) {
    return key;
  }
  
  if (!translations[key]) {
    // Pour le développement, loggons les traductions manquantes
    console.log(`Traduction manquante pour la clé: ${key}`);
    // Transformer la clé en texte lisible
    return makeReadableKey(key);
  }
  
  return translations[key][language] || key;
};

// Fonction utilitaire pour convertir toutes les clés en texte lisible
export const makeReadableKey = (key: string): string => {
  return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
