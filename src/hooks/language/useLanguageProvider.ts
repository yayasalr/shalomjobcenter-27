
import { useState, useEffect } from 'react';
import { SupportedLanguage, TranslationDictionary } from './types';
import useLocalStorage from '../useLocalStorage';
import { useSiteSettings } from '../settings';
import { 
  commonTranslations,
  homeTranslations,
  listingsTranslations,
  jobsTranslations,
  profileTranslations,
  defaultTranslations
} from './translations/index';
import { getTranslation } from './translation-utils';

// Fonction pour déterminer les traductions à charger en fonction de la route
const getRouteTranslations = (pathname: string): TranslationDictionary => {
  // Chargeons toutes les traductions par défaut pour résoudre le problème
  return defaultTranslations;
};

export const useLanguageProvider = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { setItem } = useLocalStorage();
  // Toujours utiliser 'fr' comme langue par défaut
  const [language] = useState<SupportedLanguage>('fr');
  
  // État pour stocker les traductions basées sur la route actuelle
  const [translations, setTranslations] = useState<TranslationDictionary>({ ...defaultTranslations });

  // Mettre à jour les traductions basées sur la route actuelle
  useEffect(() => {
    // Force l'application à charger toutes les traductions
    setTranslations({ ...defaultTranslations });
    
    // Assurons-nous que le paramètre language est toujours 'fr'
    updateSettings({ language: 'fr' });
    setItem('userLanguage', 'fr');
  }, []);

  // Fonction pour changer la langue (même si nous n'avons que le français)
  const setLanguage = () => {
    setItem('userLanguage', 'fr');
    updateSettings({ language: 'fr' });
  };

  // Fonction pour traduire un texte
  const t = (key: string): string => {
    // Si la clé est undefined ou null, renvoyer une chaîne vide
    if (!key) return '';
    
    const translation = getTranslation(key, 'fr', translations);
    
    // Si la traduction est la même que la clé, c'est que la traduction n'existe pas
    if (translation === key) {
      console.log(`Traduction manquante pour la clé: ${key}`);
      // Retourner une version plus lisible de la clé si pas de traduction
      return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return translation;
  };

  return {
    language: 'fr' as SupportedLanguage,
    setLanguage,
    t,
  };
};
