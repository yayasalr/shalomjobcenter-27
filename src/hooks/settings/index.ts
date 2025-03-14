
import { createContext, useContext, ReactNode } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { useSiteSettings as useSettings } from './useSiteSettings';

// Contexte pour les paramètres du site
const SiteSettingsContext = createContext<ReturnType<typeof useSettings>>({} as ReturnType<typeof useSettings>);

// Provider pour les paramètres du site
export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const settingsValue = useSettings();

  return (
    <SiteSettingsContext.Provider value={settingsValue}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

// Hook pour utiliser les paramètres du site
export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings doit être utilisé à l\'intérieur d\'un SiteSettingsProvider');
  }
  return context;
};
