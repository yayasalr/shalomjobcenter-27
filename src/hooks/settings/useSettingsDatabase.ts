
import { useState, useCallback } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { uploadBase64File } from '@/integrations/supabase/storage';
import { defaultSettings } from './useSettingsDefaults';

export type SiteSettingsRow = {
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

export const useSettingsDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Convertir une ligne de la base de données en objet SiteSettings
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
    } as SiteSettings;
  };

  // Charger les paramètres depuis Supabase
  const fetchSettings = useCallback(async (): Promise<SiteSettings> => {
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
        return convertRowToSettings(data as SiteSettingsRow);
      }
      
      return defaultSettings as SiteSettings;
    } catch (err: any) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError(err.message || 'Erreur lors du chargement des paramètres');
      
      // En cas d'erreur, retourner les paramètres par défaut
      return defaultSettings as SiteSettings;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour les paramètres dans Supabase
  const updateSettingsInDatabase = useCallback(async (settings: SiteSettings): Promise<boolean> => {
    if (!settingsId) {
      toast.error("ID des paramètres non disponible");
      return false;
    }

    try {
      setLoading(true);
      
      // Traiter les images base64 si nécessaire
      let logoUrl = settings.logo;
      let faviconUrl = settings.favicon;
      
      if (settings.logo && (settings.logo.startsWith('data:image/') || settings.logo.startsWith('blob:'))) {
        logoUrl = await uploadBase64File(settings.logo, 'logos');
      }
      
      if (settings.favicon && (settings.favicon.startsWith('data:image/') || settings.favicon.startsWith('blob:'))) {
        faviconUrl = await uploadBase64File(settings.favicon, 'favicons');
      }
      
      // Préparer les données pour Supabase
      const updateData = {
        site_name: settings.siteName,
        primary_color: settings.primaryColor,
        secondary_color: settings.secondaryColor,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        company_name: settings.companyInfo?.name || '',
        company_address: settings.companyInfo?.address,
        company_phone: settings.companyInfo?.phone,
        company_email: settings.companyInfo?.email,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('site_settings')
        .update(updateData)
        .eq('id', settingsId);
      
      if (error) throw error;
      
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour des paramètres:', err);
      setError(err.message || 'Erreur lors de la mise à jour des paramètres');
      return false;
    } finally {
      setLoading(false);
    }
  }, [settingsId]);

  // Réinitialiser les paramètres dans la base de données
  const resetSettingsInDatabase = useCallback(async (): Promise<boolean> => {
    if (!settingsId) {
      toast.error("ID des paramètres non disponible");
      return false;
    }

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
      
      const { error } = await supabase
        .from('site_settings')
        .update(resetData)
        .eq('id', settingsId);
      
      if (error) throw error;
      
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la réinitialisation des paramètres:', err);
      setError(err.message || 'Erreur lors de la réinitialisation des paramètres');
      return false;
    } finally {
      setLoading(false);
    }
  }, [settingsId]);

  return {
    loading,
    error,
    settingsId,
    fetchSettings,
    updateSettingsInDatabase,
    resetSettingsInDatabase,
    convertRowToSettings
  };
};
