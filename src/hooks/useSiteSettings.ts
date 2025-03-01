
import { useState, useEffect, useCallback } from 'react';

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
  logo: '/lovable-uploads/be3553b7-65a1-46ed-a1cf-4ad67b03a0c2.png',
  primaryColor: '#FF385C', // Rouge Airbnb
  secondaryColor: '#222222', // Gris foncé
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

// Fonction pour garantir que les paramètres sont valides
const validateSettings = (settings: any): SiteSettings => {
  const validatedSettings = { ...defaultSettings };
  
  // Fusionner les paramètres sauvegardés avec les paramètres par défaut
  if (settings) {
    // Valider les propriétés de premier niveau
    for (const key in defaultSettings) {
      if (settings[key] !== undefined && settings[key] !== null) {
        (validatedSettings as any)[key] = settings[key];
      }
    }
    
    // Valider les objets imbriqués
    for (const nestedKey of ['footer', 'socialLinks', 'reservationSettings', 'companyInfo']) {
      if (settings[nestedKey] && typeof settings[nestedKey] === 'object') {
        for (const innerKey in (defaultSettings as any)[nestedKey]) {
          if (settings[nestedKey][innerKey] !== undefined && settings[nestedKey][innerKey] !== null) {
            (validatedSettings as any)[nestedKey][innerKey] = settings[nestedKey][innerKey];
          }
        }
      }
    }
  }
  
  return validatedSettings;
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        console.log('Chargement des paramètres du site:', parsedSettings);
        return validateSettings(parsedSettings);
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres:', e);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Appliquer les paramètres au DOM lors du premier chargement
  useEffect(() => {
    applySettingsToDOM();
  }, []);

  // Appliquer les paramètres au DOM à chaque changement
  useEffect(() => {
    applySettingsToDOM();
    // Sauvegarder dans localStorage à chaque changement
    localStorage.setItem('siteSettings', JSON.stringify(settings));
  }, [settings]);

  // Gérer le mode sombre
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const updateSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
  }, []);

  const applySettingsToDOM = useCallback(() => {
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
    
    // Couleurs pour le mode clair (par défaut)
    if (!settings.darkMode) {
      document.documentElement.style.setProperty('--background', '#F1F0FB'); // Couleur de fond (gris clair)
      document.documentElement.style.setProperty('--foreground', '#1A1F2C'); // Couleur du texte (noir profond)
      document.documentElement.style.setProperty('--card', '#FFFFFF');
      document.documentElement.style.setProperty('--card-foreground', '#1A1F2C');
      document.documentElement.style.setProperty('--popover', '#FFFFFF');
      document.documentElement.style.setProperty('--popover-foreground', '#1A1F2C');
      document.documentElement.style.setProperty('--muted', '#F1F5F9');
      document.documentElement.style.setProperty('--muted-foreground', '#64748B');
      document.documentElement.style.setProperty('--border', '#E2E8F0');
      document.documentElement.style.setProperty('--input', '#E2E8F0');
    } 
    // Couleurs pour le mode sombre
    else {
      document.documentElement.style.setProperty('--background', '#1A1F2C'); // Fond sombre
      document.documentElement.style.setProperty('--foreground', '#F8FAFC'); // Texte clair
      document.documentElement.style.setProperty('--card', '#222222');
      document.documentElement.style.setProperty('--card-foreground', '#F8FAFC');
      document.documentElement.style.setProperty('--popover', '#222222');
      document.documentElement.style.setProperty('--popover-foreground', '#F8FAFC');
      document.documentElement.style.setProperty('--muted', '#333333');
      document.documentElement.style.setProperty('--muted-foreground', '#94A3B8');
      document.documentElement.style.setProperty('--border', '#333333');
      document.documentElement.style.setProperty('--input', '#333333');
    }
    
    document.documentElement.style.setProperty('--accent', '#D946EF'); // Couleur d'accent (magenta)
    console.log('Paramètres appliqués au DOM:', settings);
  }, [settings]);

  // Fonction d'exportation des paramètres
  const exportSettings = useCallback(() => {
    try {
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
    } catch (error) {
      console.error('Erreur lors de l\'exportation des paramètres:', error);
      return false;
    }
  }, [settings]);

  // Fonction d'importation des paramètres
  const importSettings = useCallback(async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsedSettings = JSON.parse(content);
          
          // Valider les paramètres importés
          if (!parsedSettings) {
            console.error('Fichier de paramètres invalide');
            resolve(false);
            return;
          }
          
          // Fusionner avec les paramètres par défaut pour garantir une structure valide
          const validatedSettings = validateSettings(parsedSettings);
          
          setSettings(validatedSettings);
          localStorage.setItem('siteSettings', JSON.stringify(validatedSettings));
          resolve(true);
        } catch (error) {
          console.error('Erreur lors de l\'importation des paramètres:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Erreur lors de la lecture du fichier');
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    applySettingsToDOM,
    exportSettings,
    importSettings
  };
};
