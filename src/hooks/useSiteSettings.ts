
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
};

// Fonction pour charger les paramètres depuis le localStorage
const loadSettings = (): SiteSettings => {
  const savedSettings = localStorage.getItem('siteSettings');
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  // Si aucune donnée n'existe, utiliser les paramètres par défaut et les sauvegarder
  localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
  return defaultSettings;
};

// Fonction pour sauvegarder les paramètres
const saveSettings = (settings: SiteSettings) => {
  localStorage.setItem('siteSettings', JSON.stringify(settings));
};

export const useSiteSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings = defaultSettings, isLoading, error } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const currentSettings = loadSettings();
      console.log("Chargement des paramètres du site:", currentSettings);
      return currentSettings;
    },
    staleTime: 0,
    gcTime: 0,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<SiteSettings>) => {
      const currentSettings = loadSettings();
      const updatedSettings = { ...currentSettings, ...newSettings };
      
      // Mise à jour des paramètres imbriqués (footer, socialLinks)
      if (newSettings.footer) {
        updatedSettings.footer = { ...currentSettings.footer, ...newSettings.footer };
      }
      
      if (newSettings.socialLinks) {
        updatedSettings.socialLinks = { ...currentSettings.socialLinks, ...newSettings.socialLinks };
      }
      
      saveSettings(updatedSettings);
      console.log("Paramètres mis à jour:", updatedSettings);
      return updatedSettings;
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(["siteSettings"], updatedSettings);
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success("Paramètres mis à jour avec succès");
      
      // Appliquer les changements de couleur immédiatement
      document.documentElement.style.setProperty('--primary', updatedSettings.primaryColor);
      document.documentElement.style.setProperty('--secondary', updatedSettings.secondaryColor);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des paramètres");
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings,
  };
};
