
import { useState, useEffect } from 'react';
import { SupportedLanguage, TranslationDictionary } from './types';
import useLocalStorage from '../useLocalStorage';
import { useSiteSettings } from '../settings';
import { defaultTranslations } from './translations/index';
import { getTranslation, makeReadableKey } from './translation-utils';

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
    
    // Liste des phrases qui sont déjà en français
    const frenchPhrases = [
      "Superbe villa avec vue", "Logement de luxe à Lomé", "Villa de luxe",
      "Tokoin, Lomé", "Adakpamé", "Lomé", "Bè", "Tokoin", "Adidogomé",
      "Agoè", "Kodjoviakopé", "Nyékonakpoè", "Hédzranawoé", "Baguida", "Doulassamé",
      "Aujourd'hui", "Bas"
    ];
    
    // Si c'est déjà une phrase française connue, la retourner directement
    if (frenchPhrases.includes(key)) {
      return key;
    }
    
    // Si la clé est très longue ou contient plusieurs mots, c'est probablement déjà en français
    if ((key.length > 15 && key.includes(' ')) || (key.includes(' à ')) || (key.includes('é'))) {
      return key;
    }
    
    const translation = getTranslation(key, 'fr', translations);
    
    // Si la traduction est exactement la même que la clé, c'est qu'elle n'a pas été trouvée
    if (translation === key) {
      console.log(`Clé de traduction manquante: ${key}`);
      // Transformer la clé en texte lisible
      return makeReadableKey(key);
    }
    
    return translation;
  };

  return {
    language: 'fr' as SupportedLanguage,
    setLanguage: () => {}, // Fonction vide car on n'autorise que le français
    t,
  };
};
