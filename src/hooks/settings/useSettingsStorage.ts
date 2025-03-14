
import { useState, useEffect } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { defaultSettings } from './useSettingsDefaults';

export const useSettingsStorage = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings as SiteSettings);
  const [initialized, setInitialized] = useState(false);

  // Fonction pour synchroniser les paramètres entre les onglets
  const synchronizeSettings = () => {
    try {
      // Vérifier si des paramètres partagés existent dans sessionStorage
      const sharedLogo = sessionStorage.getItem('shared_site_logo');
      const sharedFavicon = sessionStorage.getItem('shared_site_favicon');
      
      // Mettre à jour les paramètres avec les valeurs partagées si elles existent
      if (sharedLogo || sharedFavicon) {
        setSettings(prev => ({
          ...prev,
          logo: sharedLogo || prev.logo,
          favicon: sharedFavicon || prev.favicon
        }));
        console.log("Paramètres synchronisés depuis sessionStorage");
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation des paramètres:", error);
    }
  };

  // Charger les paramètres au démarrage
  useEffect(() => {
    try {
      // Récupérer les paramètres de localStorage
      const storedSettings = localStorage.getItem('siteSettings');
      let parsedSettings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;
      
      // S'assurer que le mode sombre est toujours désactivé
      parsedSettings.darkMode = false;
      
      // Vérifier si le logo et la favicon existent encore (peuvent être supprimés par le navigateur)
      if (parsedSettings.logo) {
        // Utiliser un logo hébergé sur un serveur plutôt qu'une data URL
        // Si c'est une data URL, vérifier si elle est toujours valide
        if (parsedSettings.logo.startsWith('data:')) {
          try {
            // Tester si l'image est corrompue
            const img = new Image();
            img.src = parsedSettings.logo;
            img.onerror = () => {
              console.warn("Logo corrompu, utilisation du logo par défaut");
              parsedSettings.logo = "/lovable-uploads/840dfb44-1c4f-4475-9321-7f361be73327.png";
              updateSettings(parsedSettings);
            };
          } catch (e) {
            parsedSettings.logo = "/lovable-uploads/840dfb44-1c4f-4475-9321-7f361be73327.png";
          }
        }
      } else {
        parsedSettings.logo = "/lovable-uploads/840dfb44-1c4f-4475-9321-7f361be73327.png";
      }
      
      // Même chose pour favicon
      if (!parsedSettings.favicon) {
        parsedSettings.favicon = "/favicon.ico";
      }
      
      // Vérifier sessionStorage pour des valeurs partagées plus récentes
      const sharedLogo = sessionStorage.getItem('shared_site_logo');
      const sharedFavicon = sessionStorage.getItem('shared_site_favicon');
      
      if (sharedLogo) {
        parsedSettings.logo = sharedLogo;
      }
      
      if (sharedFavicon) {
        parsedSettings.favicon = sharedFavicon;
      }
      
      setSettings(parsedSettings as SiteSettings);
      setInitialized(true);
      console.log("Paramètres chargés avec succès", parsedSettings);
      
      // Partager les valeurs actuelles dans sessionStorage pour d'autres onglets
      if (parsedSettings.logo) {
        sessionStorage.setItem('shared_site_logo', parsedSettings.logo);
      }
      
      if (parsedSettings.favicon) {
        sessionStorage.setItem('shared_site_favicon', parsedSettings.favicon);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
      setSettings({...defaultSettings, darkMode: false} as SiteSettings);
      setInitialized(true);
    }
    
    // Ajouter un écouteur d'événements pour la synchronisation entre les onglets
    window.addEventListener('storage', synchronizeSettings);
    
    return () => {
      window.removeEventListener('storage', synchronizeSettings);
    };
  }, []);

  // Sauvegarder les paramètres à chaque modification
  useEffect(() => {
    if (!initialized) return;
    
    try {
      // Créer une copie des paramètres
      const settingsToStore = { ...settings, darkMode: false };
      
      // Sauvegarder dans localStorage
      localStorage.setItem('siteSettings', JSON.stringify(settingsToStore));
      
      // Partager logo et favicon dans sessionStorage pour d'autres onglets
      if (settingsToStore.logo) {
        sessionStorage.setItem('shared_site_logo', settingsToStore.logo);
        // Sauvegarder également dans localStorage pour une persistance à long terme
        localStorage.setItem('site_logo', settingsToStore.logo);
      }
      
      if (settingsToStore.favicon) {
        sessionStorage.setItem('shared_site_favicon', settingsToStore.favicon);
        localStorage.setItem('site_favicon', settingsToStore.favicon);
      }
      
      // Déclencher un événement storage pour informer les autres onglets
      window.dispatchEvent(new Event('storage'));
      
      console.log("Paramètres sauvegardés avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres:", error);
    }
  }, [settings, initialized]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prevSettings) => {
      // S'assurer que le mode sombre reste désactivé
      const updatedSettings = {
        ...prevSettings,
        ...newSettings,
        darkMode: false
      };
      console.log("Paramètres mis à jour:", updatedSettings);
      return updatedSettings;
    });
  };

  const resetSettings = () => {
    // Supprimer également les images stockées séparément
    localStorage.removeItem('site_logo');
    localStorage.removeItem('site_favicon');
    sessionStorage.removeItem('shared_site_logo');
    sessionStorage.removeItem('shared_site_favicon');
    
    setSettings({...defaultSettings, darkMode: false} as SiteSettings);
    console.log("Paramètres réinitialisés");
  };

  return {
    settings,
    updateSettings,
    resetSettings
  };
};
