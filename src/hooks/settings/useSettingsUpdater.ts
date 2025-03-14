
import { useState, useCallback } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { toast } from 'sonner';
import { updateSettingsInSupabase, processBase64Images } from './utils/api';
import { convertSettingsToRow } from './utils/converters';

export const useSettingsUpdater = (
  settings: SiteSettings,
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>,
  settingsId: string | null
) => {
  const [updating, setUpdating] = useState(false);

  // Mettre à jour les paramètres dans Supabase
  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    if (!settingsId) {
      toast.error("Impossible de mettre à jour les paramètres: ID non disponible");
      return;
    }

    try {
      setUpdating(true);
      
      // Préparer les données à mettre à jour
      const updatedSettings = { ...settings, ...newSettings };
      
      // Traiter les images base64 si nécessaire
      const { logoUrl, faviconUrl } = await processBase64Images(settings, newSettings);
      
      // Mettre à jour avec les URLs d'images traitées
      const finalSettings = {
        ...updatedSettings,
        logo: logoUrl,
        favicon: faviconUrl
      };
      
      // Préparer les données pour Supabase
      const updateData = convertSettingsToRow(finalSettings);
      
      // Mettre à jour dans Supabase
      await updateSettingsInSupabase(settingsId, updateData);
      
      // Mettre à jour l'état local
      setSettings(finalSettings);
      toast.success('Paramètres mis à jour avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour des paramètres:', err);
      toast.error(err.message || 'Erreur lors de la mise à jour des paramètres');
    } finally {
      setUpdating(false);
    }
  }, [settings, settingsId, setSettings]);

  return {
    updating,
    updateSettings
  };
};
