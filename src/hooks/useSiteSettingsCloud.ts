
import { useEffect } from 'react';
import { useSettingsLoader } from './settings/useSettingsLoader';
import { useSettingsUpdater } from './settings/useSettingsUpdater';
import { useSettingsResetter } from './settings/useSettingsResetter';

export const useSiteSettingsCloud = () => {
  const {
    settings,
    setSettings,
    loading,
    error,
    settingsId,
    loadSettings
  } = useSettingsLoader();

  const {
    updating,
    updateSettings
  } = useSettingsUpdater(settings, setSettings, settingsId);

  const {
    resetting,
    resetSettings
  } = useSettingsResetter(setSettings, settingsId);

  // Charger les paramètres au démarrage
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading: loading || updating || resetting,
    error,
    updateSettings,
    resetSettings,
    loadSettings
  };
};
