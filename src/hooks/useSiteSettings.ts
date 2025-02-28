
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  // Nouvelle fonctionnalité #1: Paramètres de réservation
  reservationSettings: {
    minStay: number;
    maxStay: number;
    advanceBookingDays: number;
    instantBooking: boolean;
  };
  // Nouvelle fonctionnalité #2: Coordonnées de l'entreprise
  companyInfo: {
    address: string;
    phone: string;
    email: string;
    registrationNumber: string;
  };
  // Propriétés supplémentaires pour les paramètres du site
  siteDescription?: string;
  adminEmail?: string;
  supportEmail?: string;
  phoneNumber?: string;
  address?: string;
  favicon?: string;
  fontFamily?: string;
  borderRadius?: string;
  darkMode?: boolean;
  defaultLanguage?: string;
  defaultCurrency?: string;
  dateFormat?: string;
  timeFormat?: string;
  timezone?: string;
  maxFileSize?: number;
  allowedFileTypes?: string;
  imageCompression?: string;
  watermarkEnabled?: boolean;
  watermarkOpacity?: number;
  mailProvider?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPassword?: string;
  senderName?: string;
  senderEmail?: string;
  currency?: string;
  stripeLiveKey?: string;
  stripeTestKey?: string;
  paypalClientId?: string;
  testMode?: boolean;
  commissionRate?: number;
  minWithdrawalAmount?: number;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  enableSocialLogin?: boolean;
  enableSocialSharing?: boolean;
}

// Paramètres par défaut
const defaultSettings: SiteSettings = {
  siteName: "Location+",
  logo: "/placeholder.svg",
  primaryColor: "#FF385C", // Airbnb red
  secondaryColor: "#222222",
  language: "fr",
  footer: {
    contact: "Contactez-nous à contact@locationplus.fr",
    about: "Location+ est une plateforme de location de logements.",
    terms: "Conditions d'utilisation de la plateforme Location+.",
    policy: "Politique de confidentialité de Location+.",
  },
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  // Nouvelle fonctionnalité #1: Paramètres de réservation
  reservationSettings: {
    minStay: 1,
    maxStay: 30,
    advanceBookingDays: 90,
    instantBooking: true,
  },
  // Nouvelle fonctionnalité #2: Coordonnées de l'entreprise
  companyInfo: {
    address: "123 Rue Principale, Lomé, Togo",
    phone: "+228 12 34 56 78",
    email: "info@locationplus.tg",
    registrationNumber: "RCCM TG-LOM-2023-B-12345",
  },
  // Valeurs par défaut pour les propriétés supplémentaires
  siteDescription: "Plateforme de location de logements",
  adminEmail: "admin@locationplus.fr",
  supportEmail: "support@locationplus.fr",
  phoneNumber: "+228 90 123 456",
  address: "Lomé, Togo",
  favicon: "/favicon.ico",
  fontFamily: "Inter",
  borderRadius: "medium",
  darkMode: false,
  defaultLanguage: "fr",
  defaultCurrency: "XOF",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  timezone: "Africa/Lome",
  maxFileSize: 5,
  allowedFileTypes: "jpg,jpeg,png,gif,pdf",
  imageCompression: "medium",
  watermarkEnabled: false,
  watermarkOpacity: 50,
  mailProvider: "smtp",
  smtpHost: "smtp.example.com",
  smtpPort: "587",
  smtpUser: "user@example.com",
  smtpPassword: "",
  senderName: "Location+",
  senderEmail: "no-reply@locationplus.fr",
  currency: "XOF",
  stripeLiveKey: "",
  stripeTestKey: "",
  paypalClientId: "",
  testMode: true,
  commissionRate: 5,
  minWithdrawalAmount: 1000,
  facebookUrl: "https://facebook.com/locationplus",
  twitterUrl: "https://twitter.com/locationplus",
  instagramUrl: "https://instagram.com/locationplus",
  linkedinUrl: "https://linkedin.com/company/locationplus",
  youtubeUrl: "",
  enableSocialLogin: true,
  enableSocialSharing: true,
};

// Fonction pour charger les paramètres depuis le localStorage
const loadSettings = (): SiteSettings => {
  const savedSettings = localStorage.getItem('siteSettings');
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      // S'assurer que tous les champs requis sont présents
      return {
        ...defaultSettings, // Commencer avec les paramètres par défaut
        ...parsed, // Superposer les paramètres sauvegardés
        // S'assurer que les objets imbriqués sont correctement fusionnés
        footer: { ...defaultSettings.footer, ...parsed.footer },
        socialLinks: { ...defaultSettings.socialLinks, ...parsed.socialLinks },
        reservationSettings: { ...defaultSettings.reservationSettings, ...parsed.reservationSettings },
        companyInfo: { ...defaultSettings.companyInfo, ...parsed.companyInfo },
      };
    } catch (e) {
      console.error("Erreur de parsing des paramètres:", e);
      return defaultSettings;
    }
  }
  // Si aucune donnée n'existe, utiliser les paramètres par défaut et les sauvegarder
  localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
  return defaultSettings;
};

// Fonction pour sauvegarder les paramètres
const saveSettings = (settings: SiteSettings) => {
  localStorage.setItem('siteSettings', JSON.stringify(settings));
};

// Fonction pour appliquer les paramètres du site au DOM
const applySettingsToDOM = (settings: SiteSettings) => {
  // Appliquer les couleurs principales
  document.documentElement.style.setProperty('--primary', settings.primaryColor);
  document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
  
  // Définir la couleur primaire pour les éléments Tailwind
  document.documentElement.style.setProperty('--airbnb-red', settings.primaryColor);
  
  // Mettre à jour le titre de la page
  document.title = settings.siteName;
  
  // Mettre à jour les éléments du site avec le nom du site
  const siteNameElements = document.querySelectorAll('.site-name');
  siteNameElements.forEach(element => {
    element.textContent = settings.siteName;
  });
  
  // Mettre à jour le logo si présent
  const logoElements = document.querySelectorAll('.site-logo');
  logoElements.forEach((element: HTMLElement) => {
    if (element instanceof HTMLImageElement) {
      element.src = settings.logo;
      element.alt = settings.siteName;
    }
  });
  
  console.log("Paramètres appliqués au DOM:", settings);
}

export const useSiteSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings = defaultSettings, isLoading, error } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const currentSettings = loadSettings();
      console.log("Chargement des paramètres du site:", currentSettings);
      
      // Appliquer les paramètres au chargement
      setTimeout(() => applySettingsToDOM(currentSettings), 0);
      
      return currentSettings;
    },
    staleTime: 0,
    gcTime: 0,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<SiteSettings>) => {
      const currentSettings = loadSettings();
      
      // Fusion de premier niveau
      const updatedSettings = { ...currentSettings, ...newSettings };
      
      // Fusion des objets imbriqués
      if (newSettings.footer) {
        updatedSettings.footer = { ...currentSettings.footer, ...newSettings.footer };
      }
      
      if (newSettings.socialLinks) {
        updatedSettings.socialLinks = { ...currentSettings.socialLinks, ...newSettings.socialLinks };
      }
      
      if (newSettings.reservationSettings) {
        updatedSettings.reservationSettings = { 
          ...currentSettings.reservationSettings, 
          ...newSettings.reservationSettings 
        };
      }
      
      if (newSettings.companyInfo) {
        updatedSettings.companyInfo = { 
          ...currentSettings.companyInfo, 
          ...newSettings.companyInfo 
        };
      }
      
      saveSettings(updatedSettings);
      console.log("Paramètres mis à jour:", updatedSettings);
      
      // Appliquer immédiatement les paramètres au DOM
      applySettingsToDOM(updatedSettings);
      
      return updatedSettings;
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(["siteSettings"], updatedSettings);
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success("Paramètres mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des paramètres");
    },
  });

  // Nouvelle fonctionnalité #3: Fonction de réinitialisation des paramètres
  const resetSettings = useMutation({
    mutationFn: async () => {
      saveSettings(defaultSettings);
      console.log("Paramètres réinitialisés aux valeurs par défaut");
      
      // Appliquer immédiatement les paramètres par défaut au DOM
      applySettingsToDOM(defaultSettings);
      
      return defaultSettings;
    },
    onSuccess: () => {
      queryClient.setQueryData(["siteSettings"], defaultSettings);
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success("Paramètres réinitialisés aux valeurs par défaut");
    },
    onError: () => {
      toast.error("Erreur lors de la réinitialisation des paramètres");
    },
  });

  // Nouvelle fonctionnalité #4: Fonction d'exportation des paramètres
  const exportSettings = () => {
    try {
      const currentSettings = loadSettings();
      const dataStr = JSON.stringify(currentSettings, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${settings.siteName.replace(/\s+/g, '_').toLowerCase()}_settings_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success("Paramètres exportés avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'exportation des paramètres:", error);
      toast.error("Erreur lors de l'exportation des paramètres");
      return false;
    }
  };

  // Nouvelle fonctionnalité #5: Fonction d'importation des paramètres
  const importSettings = async (jsonFile: File) => {
    try {
      const fileContent = await jsonFile.text();
      const importedSettings = JSON.parse(fileContent);
      
      // Vérifier que le fichier contient les champs requis minimaux
      if (!importedSettings.siteName || !importedSettings.primaryColor) {
        throw new Error("Format de fichier invalide");
      }
      
      // Fusionner avec les paramètres par défaut pour s'assurer que tous les champs requis sont présents
      const mergedSettings = {
        ...defaultSettings,
        ...importedSettings,
        footer: { ...defaultSettings.footer, ...importedSettings.footer },
        socialLinks: { ...defaultSettings.socialLinks, ...importedSettings.socialLinks },
        reservationSettings: { ...defaultSettings.reservationSettings, ...importedSettings.reservationSettings },
        companyInfo: { ...defaultSettings.companyInfo, ...importedSettings.companyInfo },
      };
      
      // Mettre à jour les paramètres
      updateSettings.mutate(mergedSettings);
      return true;
    } catch (error) {
      console.error("Erreur lors de l'importation des paramètres:", error);
      toast.error("Erreur lors de l'importation des paramètres: format invalide");
      return false;
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    applySettingsToDOM: () => applySettingsToDOM(settings),
  };
};
