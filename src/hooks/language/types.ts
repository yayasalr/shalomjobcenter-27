
export type SupportedLanguage = 'fr';

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

export interface TranslationDictionary {
  [key: string]: {
    fr: string;
    en?: string; // Gardons la compatibilité avec les traductions existantes
  };
}
