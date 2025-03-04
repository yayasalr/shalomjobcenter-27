
import { useSettingsStorage } from './useSettingsStorage';
import { useSettingsExportImport } from './useSettingsExportImport';
import { useSettingsUI } from './useSettingsUI';

export const useSiteSettings = () => {
  const { settings, updateSettings, resetSettings } = useSettingsStorage();
  const { exportSettings, importSettings } = useSettingsExportImport(settings, updateSettings);
  const { handleCompanyInfoChange, applySettingsToDOM } = useSettingsUI(settings);

  return { 
    settings, 
    updateSettings, 
    handleCompanyInfoChange,
    resetSettings,
    exportSettings,
    importSettings,
    applySettingsToDOM 
  };
};
