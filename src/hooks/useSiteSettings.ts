
import { useState, useEffect, useCallback } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { defaultSettings } from '@/utils/siteSettings/defaultSettings';
import { validateSettings } from '@/utils/siteSettings/validateSettings';
import { applySettingsToDOM } from '@/utils/siteSettings/domUtils';
import { exportSettings as exportSettingsUtil, importSettings as importSettingsUtil } from '@/utils/siteSettings/exportImport';

export type { SiteSettings } from '@/types/siteSettings';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        console.log('Loading site settings:', parsedSettings);
        return validateSettings(parsedSettings);
      } catch (e) {
        console.error('Error loading settings:', e);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Apply settings to DOM on first load
  useEffect(() => {
    applySettingsToDOM(settings);
  }, []);

  // Apply settings to DOM on each change
  useEffect(() => {
    applySettingsToDOM(settings);
    // Save to localStorage on each change
    localStorage.setItem('siteSettings', JSON.stringify(settings));
  }, [settings]);

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

  // Export settings function
  const exportSettingsWrapper = useCallback(() => {
    return exportSettingsUtil(settings);
  }, [settings]);

  // Import settings function
  const importSettingsWrapper = useCallback(async (file: File): Promise<boolean> => {
    return importSettingsUtil(file, setSettings);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    applySettingsToDOM: useCallback(() => applySettingsToDOM(settings), [settings]),
    exportSettings: exportSettingsWrapper,
    importSettings: importSettingsWrapper
  };
};
