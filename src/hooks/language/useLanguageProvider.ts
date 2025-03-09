
import { useState, useEffect } from 'react';
import { SupportedLanguage, TranslationDictionary } from './types';
import useLocalStorage from '../useLocalStorage';
import { useSiteSettings } from '../settings';
import { defaultTranslations } from './translations/index';
import { getTranslation } from './translation-utils';

export const useLanguageProvider = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { setItem } = useLocalStorage();
  
  // Forcer l'utilisation du français uniquement
  const [language] = useState<SupportedLanguage>('fr');
  const [translations] = useState<TranslationDictionary>(defaultTranslations);

  // Assurons-nous que les paramètres de langue sont toujours en français
  useEffect(() => {
    updateSettings({ language: 'fr' });
    setItem('userLanguage', 'fr');
  }, []);

  // Fonction de traduction améliorée
  const t = (key: string): string => {
    if (!key) return '';
    
    // Si la clé est très longue, c'est probablement un texte déjà en français
    if (key.length > 30 && key.includes(' ')) return key;
    
    const translation = getTranslation(key, 'fr', translations);
    
    // Si la traduction est exactement la même que la clé, c'est qu'elle n'a pas été trouvée
    if (translation === key) {
      console.log(`Clé de traduction manquante: ${key}`);
      // Transformer la clé en texte lisible
      return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    return translation;
  };

  return {
    language: 'fr' as SupportedLanguage,
    setLanguage: () => {}, // Fonction vide car on n'autorise que le français
    t,
  };
};
