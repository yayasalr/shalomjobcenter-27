
import { useState, useCallback } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { defaultSettings } from './useSettingsDefaults';
import { toast } from 'sonner';
import { updateSettingsInSupabase } from './utils/api';
import { convertSettingsToRow } from './utils/converters';

export const useSettingsResetter = (
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>,
  settingsId: string | null
) => {
  const [resetting, setResetting] = useState(false);

  // Réinitialiser les paramètres
  const resetSettings = useCallback(async () => {
    if (!settingsId) {
      toast.error("Impossible de réinitialiser les paramètres: ID non disponible");
      return;
    }

    try {
      setResetting(true);
      
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
      await updateSettingsInSupabase(settingsId, resetData);
      
      // Réinitialiser l'état local
      setSettings(defaultSettings as SiteSettings);
      toast.success('Paramètres réinitialisés avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la réinitialisation des paramètres:', err);
      toast.error(err.message || 'Erreur lors de la réinitialisation des paramètres');
    } finally {
      setResetting(false);
    }
  }, [settingsId, setSettings]);

  return {
    resetting,
    resetSettings
  };
};
