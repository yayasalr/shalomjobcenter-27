
import React, { createContext, useContext, ReactNode } from 'react';

// Context simple qui fournit une fonction factice pour la compatibilité
interface LanguageContextType {
  t: (key: string) => string;
}

// Création du contexte avec valeurs par défaut
export const LanguageContext = createContext<LanguageContextType>({
  t: (key) => key
});

// Hook pour les composants
export const useLanguage = () => useContext(LanguageContext);

// Provider pour la compatibilité avec le code existant
export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Fonction de traduction factice qui renvoie simplement la clé
  // Cette fonction est maintenue uniquement pour la compatibilité
  const t = (key: string): string => key;
  
  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Fonction de compatibilité
export const useLanguageProvider = () => {
  const t = (key: string): string => key;
  return { t };
};
