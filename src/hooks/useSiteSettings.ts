
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

  useEffect(() => {
    const storedSettings = localStorage.getItem('siteSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
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
    setSettings(defaultSettings as SiteSettings);
  };

  const exportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
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
    
    // Set the favicon dynamically
    if (settings.favicon) {
      const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (faviconLink) {
        faviconLink.href = settings.favicon;
      } else {
        const newFaviconLink = document.createElement('link');
        newFaviconLink.rel = 'icon';
        newFaviconLink.href = settings.favicon;
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
