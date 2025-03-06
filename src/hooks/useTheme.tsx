
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light'; // Seulement 'light' comme option maintenant

interface ThemeProviderProps {
  children: React.ReactNode;
  storageKey?: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeContextType = {
  theme: 'light',
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export function ThemeProvider({
  children,
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Supprimer toute classe dark qui pourrait être présente
    root.classList.remove('dark');
    
    // Toujours définir le thème clair
    root.setAttribute('data-theme', 'light');
    root.classList.add('light');
    
    // Stocker le thème en local storage
    localStorage.setItem(storageKey, 'light');
  }, [storageKey]);

  const value = {
    theme: 'light',
    setTheme: () => {
      // Ne change rien, toujours en mode clair
      localStorage.setItem(storageKey, 'light');
    },
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
    
  return context;
};
