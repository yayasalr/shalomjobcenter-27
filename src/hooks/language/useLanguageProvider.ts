
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
  // Détecter la route actuelle
  if (pathname.includes('/jobs') || pathname.includes('/job/')) {
    return { ...commonTranslations, ...jobsTranslations };
  } else if (pathname.includes('/listings') || pathname.includes('/listing/')) {
    return { ...commonTranslations, ...listingsTranslations };
  } else if (pathname.includes('/profile') || pathname.includes('/user/')) {
    return { ...commonTranslations, ...profileTranslations };
  } else if (pathname === '/' || pathname.includes('/home')) {
    return { ...commonTranslations, ...homeTranslations };
  }
  
  // Route par défaut: charger toutes les traductions
  return defaultTranslations;
};

export const useLanguageProvider = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { setItem, getItem } = useLocalStorage();
  // Toujours utiliser 'fr' comme langue
  const [language, setLanguageState] = useState<SupportedLanguage>('fr');
  
  // État pour stocker les traductions basées sur la route actuelle
  const [translations, setTranslations] = useState(defaultTranslations);

  // Mettre à jour les traductions basées sur la route actuelle
  useEffect(() => {
    const updateTranslationsForRoute = () => {
      const routeTranslations = getRouteTranslations(window.location.pathname);
      setTranslations(routeTranslations);
    };

    // Mettre à jour les traductions au chargement initial
    updateTranslationsForRoute();

    // Écouter les changements de route
    const handleRouteChange = () => {
      updateTranslationsForRoute();
    };

    // Écouter les événements de navigation
    window.addEventListener('popstate', handleRouteChange);
    
    // Créer un observateur pour détecter les changements dans l'URL
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPathname) {
        currentPathname = window.location.pathname;
        updateTranslationsForRoute();
      }
    });
    
    let currentPathname = window.location.pathname;
    
    // Observer les changements dans le document
    observer.observe(document, { subtree: true, childList: true });

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      observer.disconnect();
    };
  }, []);

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
