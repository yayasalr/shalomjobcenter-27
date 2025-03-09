
import { SupportedLanguage, TranslationDictionary } from './types';

// Function to get a translation for a key
export const getTranslation = (
  key: string,
  language: SupportedLanguage,
  translations: TranslationDictionary
): string => {
  if (!translations[key]) {
    // For development, log missing translations
    console.log(`Missing translation for key: ${key}`);
    return key;
  }
  
  return translations[key][language] || translations[key]['fr'] || key;
};
