
export type SupportedLanguage = 'fr' | 'en';

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

export interface TranslationDictionary {
  [key: string]: {
    fr: string;
    en: string;
  };
}
