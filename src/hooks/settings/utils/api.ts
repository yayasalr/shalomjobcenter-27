
import { supabase } from '@/integrations/supabase/client';
import { SiteSettings } from '@/types/siteSettings';
import { uploadBase64File } from '@/integrations/supabase/storage';
import { toast } from 'sonner';
import { convertSettingsToRow, SiteSettingsRow } from './converters';

/**
 * Chargement des paramètres depuis Supabase
 */
export const fetchSettings = async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    throw error;
  }

  return data as SiteSettingsRow;
};

/**
 * Mise à jour des paramètres dans Supabase
 */
export const updateSettingsInSupabase = async (
  settingsId: string,
  updateData: ReturnType<typeof convertSettingsToRow>
) => {
  const { error } = await supabase
    .from('site_settings')
    .update(updateData)
    .eq('id', settingsId);

  if (error) {
    throw error;
  }
};

/**
 * Téléchargement d'image en base64
 */
export const processBase64Images = async (
  settings: SiteSettings,
  newSettings: Partial<SiteSettings>
) => {
  let logoUrl = settings.logo;
  let faviconUrl = settings.favicon;

  // Télécharger le logo s'il s'agit d'une chaîne base64
  if (newSettings.logo && isBase64Image(newSettings.logo)) {
    try {
      logoUrl = await uploadBase64File(newSettings.logo, 'logos');
    } catch (err) {
      console.error('Erreur lors du téléchargement du logo:', err);
      toast.error('Erreur lors du téléchargement du logo');
    }
  } else if (newSettings.logo) {
    logoUrl = newSettings.logo;
  }

  // Télécharger le favicon s'il s'agit d'une chaîne base64
  if (newSettings.favicon && isBase64Image(newSettings.favicon)) {
    try {
      faviconUrl = await uploadBase64File(newSettings.favicon, 'favicons');
    } catch (err) {
      console.error('Erreur lors du téléchargement du favicon:', err);
      toast.error('Erreur lors du téléchargement du favicon');
    }
  } else if (newSettings.favicon) {
    faviconUrl = newSettings.favicon;
  }

  return { logoUrl, faviconUrl };
};

/**
 * Vérifie si une chaîne est une image en base64
 */
export const isBase64Image = (data: string): boolean => {
  return data.startsWith('data:image/') || data.startsWith('blob:');
};
