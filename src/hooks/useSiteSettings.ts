
import { useState, useEffect } from 'react';
import { SiteSettings } from '@/types/siteSettings';

const defaultSettings: Partial<SiteSettings> = {
  primaryColor: '#007BFF',
  secondaryColor: '#6C757D',
  logo: '/logo.png',
  logoUrl: '/logo.png',
  siteName: 'Shalom Job Center',
  favicon: '/favicon.ico',
  language: 'fr',
  facebookUrl: 'https://facebook.com',
  twitterUrl: 'https://twitter.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',
  darkMode: false,
  footer: {
    contact: 'Contactez-nous pour plus d\'informations',
    about: 'SHALOM JOB CENTER est une agence de placement spécialisée dans le recrutement et le placement de personnel qualifié.',
    terms: 'Conditions d\'utilisation',
    policy: 'Politique de confidentialité'
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com'
  },
  companyInfo: {
    address: '123 Main Street, Anytown',
    phone: '+15551234567',
    email: 'info@example.com',
    registrationNumber: '123456789',
    mapLocation: ''
  },
};

export const useSiteSettings = () => {
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

  const handleCompanyInfoChange = (field: keyof SiteSettings['companyInfo'], value: string) => {
    updateSettings({
      companyInfo: {
        ...settings.companyInfo,
        [field]: value,
      },
    });
  };

  // Add the missing functions
  const resetSettings = () => {
    // Supprimer également les images stockées séparément
    localStorage.removeItem('site_logo');
    localStorage.removeItem('site_favicon');
    
    setSettings(defaultSettings as SiteSettings);
  };

  const exportSettings = () => {
    try {
      // Récupérer les images stockées séparément pour l'export
      let exportSettings = { ...settings };
      
      const storedLogo = localStorage.getItem('site_logo');
      if (storedLogo && settings.logo === 'stored_separately') {
        exportSettings.logo = storedLogo;
      }
      
      const storedFavicon = localStorage.getItem('site_favicon');
      if (storedFavicon && settings.favicon === 'stored_separately') {
        exportSettings.favicon = storedFavicon;
      }
      
      const dataStr = JSON.stringify(exportSettings, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'site-settings.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (error) {
      console.error("Error exporting settings:", error);
      return false;
    }
  };

  const importSettings = async (file: File) => {
    try {
      const text = await file.text();
      const newSettings = JSON.parse(text);
      
      // Simple validation to ensure it's a settings file
      if (!newSettings.primaryColor && !newSettings.companyInfo) {
        throw new Error("Invalid settings file");
      }
      
      // Gérer les images importées
      if (newSettings.logo && newSettings.logo.startsWith('data:')) {
        localStorage.setItem('site_logo', newSettings.logo);
      }
      
      if (newSettings.favicon && newSettings.favicon.startsWith('data:')) {
        localStorage.setItem('site_favicon', newSettings.favicon);
      }
      
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error("Error importing settings:", error);
      return false;
    }
  };

  const applySettingsToDOM = () => {
    // Apply custom CSS variables to the document root
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    
    // Récupérer le favicon réel si nécessaire
    let faviconSrc = settings.favicon;
    if (faviconSrc === 'stored_separately') {
      const storedFavicon = localStorage.getItem('site_favicon');
      if (storedFavicon) {
        faviconSrc = storedFavicon;
      } else {
        faviconSrc = '/favicon.ico'; // Fallback
      }
    }
    
    // Set the favicon dynamically
    if (faviconSrc) {
      const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (faviconLink) {
        faviconLink.href = faviconSrc;
      } else {
        const newFaviconLink = document.createElement('link');
        newFaviconLink.rel = 'icon';
        newFaviconLink.href = faviconSrc;
        document.head.appendChild(newFaviconLink);
      }
    }
  };

  return { 
    settings, 
    updateSettings, 
    handleCompanyInfoChange,
    resetSettings,
    exportSettings,
    importSettings,
    applySettingsToDOM 
  };
};
