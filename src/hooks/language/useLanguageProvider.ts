
import { useState, useEffect } from 'react';
import { SupportedLanguage } from './types';
import useLocalStorage from '../useLocalStorage';
import { useSiteSettings } from '../settings';
import { defaultTranslations } from './translations';
import { getTranslation } from './translation-utils';

export const useLanguageProvider = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { setItem, getItem } = useLocalStorage();
  const [language, setLanguageState] = useState<SupportedLanguage>(settings.language || 'fr');
  const [translations, setTranslations] = useState(defaultTranslations);

  // Function to change the language
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    setItem('userLanguage', lang);
    updateSettings({ language: lang });
  };

  // Function to translate a text
  const t = (key: string): string => {
    return getTranslation(key, language, translations);
  };

  // Load saved language
  useEffect(() => {
    const savedLanguage = getItem<SupportedLanguage>('userLanguage', settings.language || 'fr');
    setLanguageState(savedLanguage);
  }, [settings.language]);

  // Force French language if not already set
  useEffect(() => {
    if (language !== 'fr') {
      setLanguage('fr');
    }
  }, [language]);

  return {
    language,
    setLanguage,
    t,
  };
};
