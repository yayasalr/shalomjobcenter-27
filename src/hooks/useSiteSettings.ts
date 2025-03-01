
import { useState, useCallback } from 'react';

export interface SiteSettings {
  siteName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  language: 'fr' | 'en';
  footer: {
    contact: string;
    about: string;
    terms: string;
    policy: string;
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  reservationSettings: {
    minStay: number;
    maxStay: number;
    advanceBookingDays: number;
    instantBooking: boolean;
  };
  companyInfo: {
    address: string;
    phone: string;
    email: string;
    registrationNumber: string;
  };
  siteDescription: string;
  adminEmail: string;
  supportEmail: string;
  phoneNumber: string;
  address: string;
  favicon: string;
  fontFamily: string;
  borderRadius: 'small' | 'medium' | 'large';
  darkMode: boolean;
  defaultLanguage: string;
  defaultCurrency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  timezone: string;
  maxFileSize: number;
  allowedFileTypes: string;
  imageCompression: 'low' | 'medium' | 'high';
  watermarkEnabled: boolean;
  watermarkOpacity: number;
  watermarkImage: string;
  mailProvider: 'smtp' | 'sendgrid' | 'mailgun';
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  senderName: string;
  senderEmail: string;
  currency: string;
  stripeLiveKey: string;
  stripeTestKey: string;
  paypalClientId: string;
  testMode: boolean;
  commissionRate: number;
  minWithdrawalAmount: number;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  enableSocialLogin: boolean;
  enableSocialSharing: boolean;
}

const defaultSettings: SiteSettings = {
  siteName: 'SHALOM JOB CENTER',
  logo: '/placeholder.svg',
  primaryColor: '#8B5CF6', // Violet
  secondaryColor: '#E5DEFF', // Violet clair
  language: 'fr',
  footer: {
    contact: 'Contactez-nous à contact@shalomjobcenter.fr',
    about: 'SHALOM JOB CENTER est une plateforme de location de logements et d\'emploi.',
    terms: 'Conditions d\'utilisation de la plateforme SHALOM JOB CENTER.',
    policy: 'Politique de confidentialité de SHALOM JOB CENTER.'
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com'
  },
  reservationSettings: {
    minStay: 1,
    maxStay: 30,
    advanceBookingDays: 90,
    instantBooking: true
  },
  companyInfo: {
    address: '123 Rue Principale, Lomé, Togo',
    phone: '+228 12 34 56 78',
    email: 'info@shalomjobcenter.tg',
    registrationNumber: 'RCCM TG-LOM-2023-B-12345'
  },
  siteDescription: 'Plateforme de location de logements et de recherche d\'emploi',
  adminEmail: 'admin@shalomjobcenter.fr',
  supportEmail: 'support@shalomjobcenter.fr',
  phoneNumber: '+228 90 123 456',
  address: 'Lomé, Togo',
  favicon: '/favicon.ico',
  fontFamily: 'Inter',
  borderRadius: 'medium',
  darkMode: false,
  defaultLanguage: 'fr',
  defaultCurrency: 'XOF',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  timezone: 'Africa/Lome',
  maxFileSize: 5,
  allowedFileTypes: 'jpg,jpeg,png,gif,pdf',
  imageCompression: 'medium',
  watermarkEnabled: false,
  watermarkOpacity: 50,
  watermarkImage: '/placeholder.svg',
  mailProvider: 'smtp',
  smtpHost: 'smtp.example.com',
  smtpPort: '587',
  smtpUser: 'user@example.com',
  smtpPassword: '',
  senderName: 'SHALOM JOB CENTER',
  senderEmail: 'no-reply@shalomjobcenter.fr',
  currency: 'XOF',
  stripeLiveKey: '',
  stripeTestKey: '',
  paypalClientId: '',
  testMode: true,
  commissionRate: 5,
  minWithdrawalAmount: 1000,
  facebookUrl: 'https://facebook.com/shalomjobcenter',
  twitterUrl: 'https://twitter.com/shalomjobcenter',
  instagramUrl: 'https://instagram.com/shalomjobcenter',
  linkedinUrl: 'https://linkedin.com/company/shalomjobcenter',
  youtubeUrl: '',
  enableSocialLogin: true,
  enableSocialSharing: true
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        console.log('Chargement des paramètres du site:', parsedSettings);
        return parsedSettings;
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres:', e);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const updateSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('siteSettings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
    applySettingsToDOM();
  }, []);

  const applySettingsToDOM = useCallback(() => {
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
    document.documentElement.style.setProperty('--background', '#F1F0FB'); // Couleur de fond (gris clair)
    document.documentElement.style.setProperty('--foreground', '#1A1F2C'); // Couleur du texte (noir profond)
    document.documentElement.style.setProperty('--accent', '#D946EF'); // Couleur d'accent (magenta)
    console.log('Paramètres appliqués au DOM:', settings);
  }, [settings]);

  // Add exportSettings function
  const exportSettings = useCallback(() => {
    const settingsString = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shalomjobcenter-settings.json';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    return true;
  }, [settings]);

  // Add importSettings function
  const importSettings = useCallback(async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsedSettings = JSON.parse(content);
          
          // Validate the imported settings
          if (!parsedSettings.siteName || !parsedSettings.primaryColor) {
            console.error('Invalid settings file');
            resolve(false);
            return;
          }
          
          setSettings(parsedSettings);
          localStorage.setItem('siteSettings', content);
          applySettingsToDOM();
          resolve(true);
        } catch (error) {
          console.error('Error importing settings:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  }, [applySettingsToDOM]);

  return {
    settings,
    updateSettings,
    resetSettings,
    applySettingsToDOM,
    exportSettings,
    importSettings
  };
};
