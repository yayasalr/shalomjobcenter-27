
import { useState, useEffect } from 'react';
import { SupportedLanguage } from './types';
import useLocalStorage from '../useLocalStorage';
import { useSiteSettings } from '../settings';
import { defaultTranslations } from './translations';
import { getTranslation } from './translation-utils';

export const useLanguageProvider = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { setItem, getItem } = useLocalStorage();
  // Toujours utiliser 'fr' comme langue
  const [language, setLanguageState] = useState<SupportedLanguage>('fr');
  const [translations, setTranslations] = useState(defaultTranslations);

  // Fonction pour changer la langue (même si nous n'avons que le français)
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState('fr');
    setItem('userLanguage', 'fr');
    updateSettings({ language: 'fr' });
  };

  // Fonction pour traduire un texte
  const t = (key: string): string => {
    return getTranslation(key, 'fr', translations);
  };

  // Initialisation
  useEffect(() => {
    setLanguageState('fr');
  }, []);

  return {
    language: 'fr' as SupportedLanguage, // Assurez-vous de typer correctement
    setLanguage,
    t,
  };
};
