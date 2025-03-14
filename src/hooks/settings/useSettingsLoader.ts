
import { useState, useCallback } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { defaultSettings } from './useSettingsDefaults';
import { fetchSettings } from './utils/api';
import { convertRowToSettings } from './utils/converters';

export const useSettingsLoader = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings as SiteSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Charger les paramètres depuis Supabase
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchSettings();
      setSettingsId(data.id);
      setSettings(convertRowToSettings(data));
    } catch (err: any) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError(err.message || 'Erreur lors du chargement des paramètres');
      
      // En cas d'erreur, charger les paramètres par défaut
      setSettings(defaultSettings as SiteSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    settings,
    setSettings,
    loading,
    error,
    settingsId,
    loadSettings
  };
};
