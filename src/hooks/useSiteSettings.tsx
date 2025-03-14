
import React, { createContext, useContext, ReactNode } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { useSiteSettingsCloud } from './useSiteSettingsCloud';
import { toast } from 'sonner';

// Contexte pour les paramètres du site
const SiteSettingsContext = createContext<{
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  resetSettings: () => void;
  loading: boolean;
  error: string | null;
}>({
  settings: {} as SiteSettings,
  updateSettings: () => {},
  resetSettings: () => {},
  loading: false,
  error: null,
});

// Provider pour les paramètres du site
export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
  } = useSiteSettingsCloud();

  // Appliquer les paramètres visuels (couleurs, favicon, etc.)
  React.useEffect(() => {
    if (!settings) return;

    try {
      // Appliquer la couleur primaire
      if (settings.primaryColor) {
        document.documentElement.style.setProperty('--primary', settings.primaryColor);
        
        // Mettre à jour la balise meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', settings.primaryColor);
        } else {
          // Créer la balise meta si elle n'existe pas
          const newMetaThemeColor = document.createElement('meta');
          newMetaThemeColor.name = 'theme-color';
          newMetaThemeColor.content = settings.primaryColor;
          document.head.appendChild(newMetaThemeColor);
        }
      }
      
      // Appliquer la couleur secondaire
      if (settings.secondaryColor) {
        document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
      }
      
      // Appliquer la favicon
      if (settings.favicon) {
        const faviconLink = document.querySelector('link[rel="icon"]');
        if (faviconLink) {
          faviconLink.setAttribute('href', settings.favicon);
        } else {
          const newFaviconLink = document.createElement('link');
          newFaviconLink.rel = 'icon';
          newFaviconLink.href = settings.favicon;
          document.head.appendChild(newFaviconLink);
        }
      }
      
      // Mettre à jour le titre du site
      if (settings.siteName) {
        document.title = settings.siteName;
      }
    } catch (error) {
      console.error('Erreur lors de l\'application des paramètres au DOM:', error);
    }
  }, [settings]);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        loading,
        error
      }}
    >
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
