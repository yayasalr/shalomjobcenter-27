
import { createContext } from 'react';
import { LanguageContextType, SupportedLanguage } from './types';

// Default values for the context
const defaultContextValue: LanguageContextType = {
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
};

// Create the language context
export const LanguageContext = createContext<LanguageContextType>(defaultContextValue);
