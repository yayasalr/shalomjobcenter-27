
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
  // Détecter la route actuelle pour charger uniquement les traductions nécessaires
  if (pathname.includes('/jobs') || pathname.includes('/job/') || pathname.includes('/emplois')) {
    return { ...commonTranslations, ...jobsTranslations };
  } else if (pathname.includes('/listings') || pathname.includes('/listing/') || pathname.includes('/logements')) {
    return { ...commonTranslations, ...listingsTranslations };
  } else if (pathname.includes('/profile') || pathname.includes('/user/') || pathname.includes('/profil')) {
    return { ...commonTranslations, ...profileTranslations };
  } else if (pathname === '/' || pathname.includes('/home') || pathname.includes('/accueil') || pathname.includes('/index')) {
    return { ...commonTranslations, ...homeTranslations, ...jobsTranslations };
  }
  
  // Route par défaut: charger toutes les traductions
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
    const updateTranslationsForRoute = () => {
      const routeTranslations = getRouteTranslations(window.location.pathname);
      setTranslations({ ...routeTranslations });
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
