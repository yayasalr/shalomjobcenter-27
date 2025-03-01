import { useState, useEffect } from 'react';

export interface SiteSettings {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  companyInfo: {
    address: string;
    phone: string;
    email: string;
    registrationNumber: string;
    mapLocation?: string; // Add this new field
  };
}

const defaultSettings: SiteSettings = {
  primaryColor: '#007BFF',
  secondaryColor: '#6C757D',
  logoUrl: '/logo.png',
  facebookUrl: 'https://facebook.com',
  twitterUrl: 'https://twitter.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',
  companyInfo: {
    address: '123 Main Street, Anytown',
    phone: '+15551234567',
    email: 'info@example.com',
    registrationNumber: '123456789',
  },
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

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

  return { settings, updateSettings, handleCompanyInfoChange };
};
