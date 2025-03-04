
import { SiteSettings } from '@/types/siteSettings';

export const useSettingsExportImport = (settings: SiteSettings, updateSettings: (newSettings: Partial<SiteSettings>) => void) => {
  const exportSettings = () => {
    try {
      // Récupérer les images stockées séparément pour l'export
      let exportSettings = { ...settings };
      
      const storedLogo = localStorage.getItem('site_logo');
      if (storedLogo && settings.logo === 'stored_separately') {
        exportSettings.logo = storedLogo;
      }
      
      const storedFavicon = localStorage.getItem('site_favicon');
      if (storedFavicon && settings.favicon === 'stored_separately') {
        exportSettings.favicon = storedFavicon;
      }
      
      const dataStr = JSON.stringify(exportSettings, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'site-settings.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (error) {
      console.error("Error exporting settings:", error);
      return false;
    }
  };

  const importSettings = async (file: File) => {
    try {
      const text = await file.text();
      const newSettings = JSON.parse(text);
      
      // Simple validation to ensure it's a settings file
      if (!newSettings.primaryColor && !newSettings.companyInfo) {
        throw new Error("Invalid settings file");
      }
      
      // Gérer les images importées
      if (newSettings.logo && newSettings.logo.startsWith('data:')) {
        localStorage.setItem('site_logo', newSettings.logo);
      }
      
      if (newSettings.favicon && newSettings.favicon.startsWith('data:')) {
        localStorage.setItem('site_favicon', newSettings.favicon);
      }
      
      updateSettings(newSettings);
      return true;
    } catch (error) {
      console.error("Error importing settings:", error);
      return false;
    }
  };

  return {
    exportSettings,
    importSettings
  };
};
