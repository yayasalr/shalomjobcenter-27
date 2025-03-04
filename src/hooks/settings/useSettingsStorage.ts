
import { useState, useEffect } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { defaultSettings } from './useSettingsDefaults';

export const useSettingsStorage = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings as SiteSettings);

  // Charger les paramètres au démarrage
  useEffect(() => {
    try {
      // Récupérer les paramètres principaux
      const storedSettings = localStorage.getItem('siteSettings');
      let parsedSettings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;
      
      // Vérifier si les images sont stockées séparément et les récupérer
      const storedLogo = localStorage.getItem('site_logo');
      if (storedLogo) {
        parsedSettings.logo = storedLogo;
      }
      
      const storedFavicon = localStorage.getItem('site_favicon');
      if (storedFavicon) {
        parsedSettings.favicon = storedFavicon;
      }
      
      setSettings(parsedSettings as SiteSettings);
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
      setSettings(defaultSettings as SiteSettings);
    }
  }, []);

  // Sauvegarder les paramètres à chaque modification
  useEffect(() => {
    try {
      // Créer une copie des paramètres pour éviter de stocker les grandes data URLs directement
      const settingsToStore = { ...settings };
      
      // Ne pas stocker les grandes data URLs dans l'objet principal
      if (settingsToStore.logo && settingsToStore.logo.startsWith('data:')) {
        // Stocker séparément
        localStorage.setItem('site_logo', settingsToStore.logo);
        // Remplacer par un indicateur dans l'objet principal
        settingsToStore.logo = 'stored_separately';
      }
      
      if (settingsToStore.favicon && settingsToStore.favicon.startsWith('data:')) {
        // Stocker séparément
        localStorage.setItem('site_favicon', settingsToStore.favicon);
        // Remplacer par un indicateur dans l'objet principal
        settingsToStore.favicon = 'stored_separately';
      }
      
      localStorage.setItem('siteSettings', JSON.stringify(settingsToStore));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres:", error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  const resetSettings = () => {
    // Supprimer également les images stockées séparément
    localStorage.removeItem('site_logo');
    localStorage.removeItem('site_favicon');
    
    setSettings(defaultSettings as SiteSettings);
  };

  return {
    settings,
    updateSettings,
    resetSettings
  };
};
