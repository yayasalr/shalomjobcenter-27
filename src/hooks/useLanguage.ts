import { useState, useEffect, createContext, useContext } from 'react';
import useLocalStorage from './useLocalStorage';
import { useSiteSettings } from './settings';

type LanguageContextType = {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  t: (key: string) => string;
};

// Créer le contexte
export const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Créer un hook pour utiliser le contexte
export const useLanguage = () => useContext(LanguageContext);

// Créer un provider pour le contexte
export const useLanguageProvider = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { setItem, getItem } = useLocalStorage();
  const [language, setLanguageState] = useState<'fr' | 'en'>(settings.language || 'fr');
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});

  // Charger les traductions
  useEffect(() => {
    // Traductions pour les textes courants
    const defaultTranslations = {
      'discover_home': {
        fr: 'Découvrez votre nouveau',
        en: 'Discover your new'
      },
      'premium_housing': {
        fr: 'Des logements premium et des opportunités d\'emploi exclusives dans les meilleurs quartiers de Lomé pour une expérience de vie supérieure.',
        en: 'Premium accommodations and exclusive job opportunities in the best neighborhoods of Lomé for a superior living experience.'
      },
      'find_housing': {
        fr: 'Trouver un logement',
        en: 'Find housing'
      },
      'job_offers': {
        fr: 'Offres d\'emploi',
        en: 'Job offers'
      },
      'popular_neighborhoods': {
        fr: 'Quartiers populaires:',
        en: 'Popular neighborhoods:'
      },
      'verified_housing': {
        fr: 'Logements vérifiés',
        en: 'Verified housing'
      },
      'secure_payments': {
        fr: 'Paiements sécurisés',
        en: 'Secure payments'
      },
      'local_support': {
        fr: 'Support local 24/7',
        en: 'Local support 24/7'
      },
      'premium_villa': {
        fr: 'Villa Premium à Lomé',
        en: 'Premium Villa in Lomé'
      },
      'housing_in_africa': {
        fr: 'Logements en Afrique et partout dans le monde',
        en: 'Housing in Africa and around the world'
      },
      'per_month': {
        fr: 'mois',
        en: 'month'
      },
      'today': {
        fr: 'Aujourd\'hui',
        en: 'Today'
      },
      'yesterday': {
        fr: 'Hier',
        en: 'Yesterday'
      },
      'days_ago': {
        fr: 'Il y a {days} jours',
        en: '{days} days ago'
      },
      'recommended_places': {
        fr: 'Lieux recommandés',
        en: 'Recommended places'
      },
      'exceptional_stays': {
        fr: 'Séjours exceptionnels',
        en: 'Exceptional stays'
      }
    };

    setTranslations(defaultTranslations);
  }, []);

  // Fonction pour changer la langue
  const setLanguage = (lang: 'fr' | 'en') => {
    setLanguageState(lang);
    setItem('userLanguage', lang);
    updateSettings({ language: lang });
  };

  // Fonction pour traduire un texte
  const t = (key: string): string => {
    if (!translations[key]) {
      return key;
    }
    
    return translations[key][language] || translations[key]['fr'] || key;
  };

  // Charger la langue sauvegardée
  useEffect(() => {
    const savedLanguage = getItem<'fr' | 'en'>('userLanguage', settings.language || 'fr');
    setLanguageState(savedLanguage);
  }, []);

  return {
    language,
    setLanguage,
    t,
  };
};
