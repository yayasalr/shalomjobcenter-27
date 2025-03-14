
import { useEffect } from 'react';
import { SiteSettings } from '@/types/siteSettings';

export const useSettingsUI = (settings: SiteSettings) => {
  // Fonction pour changer les informations de l'entreprise
  const handleCompanyInfoChange = (field: keyof SiteSettings['companyInfo'], value: string) => {
    // Cette fonction peut être implémentée si nécessaire
    console.log('Company info changed:', field, value);
  };
  
  // Appliquer les paramètres à la page
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
      let faviconUrl = settings.favicon;
      
      // Vérifier si la favicon existe dans sessionStorage (partagée)
      const sharedFavicon = sessionStorage.getItem('shared_site_favicon');
      if (sharedFavicon) {
        faviconUrl = sharedFavicon;
      }
      
      if (faviconUrl) {
        const faviconLink = document.querySelector('link[rel="icon"]');
        if (faviconLink) {
          faviconLink.setAttribute('href', faviconUrl);
        } else {
          const newFaviconLink = document.createElement('link');
          newFaviconLink.rel = 'icon';
          newFaviconLink.href = faviconUrl;
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
  
  // Écouter les événements de storage pour synchroniser les changements entre onglets
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Événement de stockage détecté, rafraîchissement des paramètres UI");
      applySettingsToDOM();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return {
    handleCompanyInfoChange,
    applySettingsToDOM
  };
};
