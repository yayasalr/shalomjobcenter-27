
import { useEffect } from 'react';
import { SiteSettings } from '@/types/siteSettings';

export const useSettingsUI = (settings: SiteSettings) => {
  // Appliquer les paramètres visuels (couleurs, favicon, etc.)
  const applySettingsToDOM = () => {
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
      
      console.log('Paramètres appliqués au DOM avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'application des paramètres au DOM:', error);
    }
  };
  
  // Appliquer les paramètres au chargement et à chaque changement
  useEffect(() => {
    applySettingsToDOM();
  }, [settings]);
  
  return {
    applySettingsToDOM
  };
};
