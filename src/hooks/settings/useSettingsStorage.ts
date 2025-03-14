
import { useState, useEffect } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { defaultSettings } from './useSettingsDefaults';

export const useSettingsStorage = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings as SiteSettings);
  const [initialized, setInitialized] = useState(false);

  // Charger les paramètres au démarrage depuis localStorage
  useEffect(() => {
    try {
      // Récupérer les paramètres de localStorage
      const storedSettings = localStorage.getItem('siteSettings');
      let parsedSettings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;
      
      // S'assurer que le mode sombre est toujours désactivé
      parsedSettings.darkMode = false;
      
      // Utiliser un logo hébergé sur le serveur si non défini
      if (!parsedSettings.logo) {
        parsedSettings.logo = "/lovable-uploads/840dfb44-1c4f-4475-9321-7f361be73327.png";
      }
      
      // Même chose pour favicon
      if (!parsedSettings.favicon) {
        parsedSettings.favicon = "/favicon.ico";
      }
      
      setSettings(parsedSettings as SiteSettings);
      setInitialized(true);
      console.log("Paramètres chargés avec succès depuis localStorage", parsedSettings);
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres depuis localStorage:", error);
      setSettings({...defaultSettings, darkMode: false} as SiteSettings);
      setInitialized(true);
    }
  }, []);

  // Sauvegarder les paramètres à chaque modification
  useEffect(() => {
    if (!initialized) return;
    
    try {
      // Créer une copie des paramètres
      const settingsToStore = { ...settings, darkMode: false };
      
      // Sauvegarder dans localStorage
      localStorage.setItem('siteSettings', JSON.stringify(settingsToStore));
      
      console.log("Paramètres sauvegardés avec succès dans localStorage");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres dans localStorage:", error);
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
      console.log("Paramètres mis à jour dans localStorage:", updatedSettings);
      return updatedSettings;
    });
  };

  const resetSettings = () => {
    setSettings({...defaultSettings, darkMode: false} as SiteSettings);
    console.log("Paramètres réinitialisés dans localStorage");
  };

  return {
    settings,
    updateSettings,
    resetSettings
  };
};
