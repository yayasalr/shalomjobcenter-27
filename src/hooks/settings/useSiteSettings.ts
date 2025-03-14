
import { useState, useCallback, useEffect } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { supabase } from '@/integrations/supabase/client';
import { defaultSettings } from '@/utils/siteSettings/defaultSettings';
import { validateSettings } from '@/utils/siteSettings/validateSettings';
import { toast } from 'sonner';
import { uploadBase64File } from '@/integrations/supabase/storage';

type SiteSettingsRow = {
  id: string;
  site_name: string;
  primary_color: string;
  secondary_color: string;
  favicon_url: string | null;
  logo_url: string | null;
  company_name: string | null;
  company_address: string | null;
  company_phone: string | null;
  company_email: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Convertit une ligne de la base de données en objet SiteSettings
 */
const convertRowToSettings = (row: SiteSettingsRow): SiteSettings => {
  return {
    ...defaultSettings,
    siteName: row.site_name,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    favicon: row.favicon_url || defaultSettings.favicon,
    logo: row.logo_url || defaultSettings.logo,
    companyInfo: {
      ...defaultSettings.companyInfo,
      name: row.company_name || '',
      address: row.company_address || defaultSettings.companyInfo.address,
      phone: row.company_phone || defaultSettings.companyInfo.phone,
      email: row.company_email || defaultSettings.companyInfo.email,
    }
  };
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Charger les paramètres depuis Supabase
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setSettingsId(data.id);
        setSettings(convertRowToSettings(data as SiteSettingsRow));
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError(err.message || 'Erreur lors du chargement des paramètres');
      
      // En cas d'erreur, charger les paramètres par défaut
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les paramètres au démarrage
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Appliquer les paramètres visuels (couleurs, favicon, etc.)
  const applySettingsToDOM = useCallback(() => {
    try {
      // Appliquer la couleur primaire
      if (settings.primaryColor) {
        document.documentElement.style.setProperty('--primary', settings.primaryColor);
        
        // Mettre à jour la balise meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', settings.primaryColor);
        } else {
          // Créer la balise meta si elle n'existe pas
          const newMetaThemeColor = document.createElement('meta');
          newMetaThemeColor.name = 'theme-color';
          newMetaThemeColor.content = settings.primaryColor;
          document.head.appendChild(newMetaThemeColor);
        }
      }
      
      // Appliquer la couleur secondaire
      if (settings.secondaryColor) {
        document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
      }
      
      // Appliquer la favicon
      if (settings.favicon) {
        const faviconLink = document.querySelector('link[rel="icon"]');
        if (faviconLink) {
          faviconLink.setAttribute('href', settings.favicon);
        } else {
          const newFaviconLink = document.createElement('link');
          newFaviconLink.rel = 'icon';
          newFaviconLink.href = settings.favicon;
          document.head.appendChild(newFaviconLink);
        }
      }
      
      // Mettre à jour le titre du site
      if (settings.siteName) {
        document.title = settings.siteName;
      }
    } catch (error) {
      console.error('Erreur lors de l\'application des paramètres au DOM:', error);
    }
  }, [settings]);

  // Appliquer les paramètres au DOM lorsqu'ils changent
  useEffect(() => {
    applySettingsToDOM();
  }, [settings, applySettingsToDOM]);

  // Mettre à jour les paramètres dans Supabase
  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    try {
      setLoading(true);
      
      // Préparer les données à mettre à jour
      const updatedSettings = { ...settings, ...newSettings };
      
      // Traiter les images base64 si nécessaire
      let logoUrl = updatedSettings.logo;
      let faviconUrl = updatedSettings.favicon;
      
      // Télécharger le logo s'il s'agit d'une chaîne base64
      if (newSettings.logo && (newSettings.logo.startsWith('data:image/') || newSettings.logo.startsWith('blob:'))) {
        try {
          logoUrl = await uploadBase64File(newSettings.logo, 'logos');
        } catch (err) {
          console.error('Erreur lors du téléchargement du logo:', err);
          toast.error('Erreur lors du téléchargement du logo');
        }
      }
      
      // Télécharger le favicon s'il s'agit d'une chaîne base64
      if (newSettings.favicon && (newSettings.favicon.startsWith('data:image/') || newSettings.favicon.startsWith('blob:'))) {
        try {
          faviconUrl = await uploadBase64File(newSettings.favicon, 'favicons');
        } catch (err) {
          console.error('Erreur lors du téléchargement du favicon:', err);
          toast.error('Erreur lors du téléchargement du favicon');
        }
      }
      
      // Préparer les données pour Supabase
      const updateData = {
        site_name: updatedSettings.siteName,
        primary_color: updatedSettings.primaryColor,
        secondary_color: updatedSettings.secondaryColor,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        company_name: updatedSettings.companyInfo?.name || '',
        company_address: updatedSettings.companyInfo?.address,
        company_phone: updatedSettings.companyInfo?.phone,
        company_email: updatedSettings.companyInfo?.email,
        updated_at: new Date().toISOString()
      };
      
      // Mettre à jour dans Supabase
      const { error } = await supabase
        .from('site_settings')
        .update(updateData)
        .eq('id', settingsId);
      
      if (error) {
        throw error;
      }
      
      // Mettre à jour l'état local
      setSettings({...settings, ...newSettings});
      toast.success('Paramètres mis à jour avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour des paramètres:', err);
      setError(err.message || 'Erreur lors de la mise à jour des paramètres');
      toast.error("Erreur lors de la mise à jour des paramètres");
    } finally {
      setLoading(false);
    }
  }, [settings, settingsId]);

  // Réinitialiser les paramètres
  const resetSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      // Réinitialiser aux valeurs par défaut dans Supabase
      const resetData = {
        site_name: defaultSettings.siteName,
        primary_color: defaultSettings.primaryColor,
        secondary_color: defaultSettings.secondaryColor,
        logo_url: null, // Utiliser null pour les valeurs par défaut
        favicon_url: null,
        company_name: null,
        company_address: null,
        company_phone: null,
        company_email: null,
        updated_at: new Date().toISOString()
      };
      
      // Mettre à jour dans Supabase
      const { error } = await supabase
        .from('site_settings')
        .update(resetData)
        .eq('id', settingsId);
      
      if (error) {
        throw error;
      }
      
      // Réinitialiser l'état local
      setSettings(defaultSettings);
      toast.success('Paramètres réinitialisés avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la réinitialisation des paramètres:', err);
      setError(err.message || 'Erreur lors de la réinitialisation des paramètres');
      toast.error("Erreur lors de la réinitialisation des paramètres");
    } finally {
      setLoading(false);
    }
  }, [settingsId]);

  // Fonction pour gérer le changement des informations de l'entreprise
  const handleCompanyInfoChange = useCallback((field: keyof SiteSettings['companyInfo'], value: string) => {
    setSettings(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }));
  }, []);

  // Exporter les paramètres
  const exportSettings = useCallback(() => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `site-settings-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (err) {
      console.error('Erreur lors de l\'exportation des paramètres:', err);
      toast.error('Erreur lors de l\'exportation des paramètres');
      return false;
    }
  }, [settings]);

  // Importer les paramètres
  const importSettings = useCallback(async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const importedSettings = JSON.parse(content);
          
          // Valider les paramètres importés
          const validatedSettings = validateSettings(importedSettings);
          
          // Mettre à jour les paramètres
          await updateSettings(validatedSettings);
          
          toast.success('Paramètres importés avec succès');
          resolve(true);
        } catch (err) {
          console.error('Erreur lors de l\'importation des paramètres:', err);
          toast.error('Erreur lors de l\'importation des paramètres');
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Erreur lors de la lecture du fichier');
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  }, [updateSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
    loadSettings,
    handleCompanyInfoChange,
    exportSettings,
    importSettings,
    applySettingsToDOM
  };
};
