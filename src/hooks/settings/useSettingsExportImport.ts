
import { SiteSettings } from '@/types/siteSettings';
import { toast } from 'sonner';

export const useSettingsExportImport = (
  settings: SiteSettings,
  updateSettings: (newSettings: Partial<SiteSettings>) => void
) => {
  // Exporter les paramètres
  const exportSettings = (): boolean => {
    try {
      const settingsJson = JSON.stringify(settings, null, 2);
      const blob = new Blob([settingsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shalom-job-center-settings.json';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log("Paramètres exportés avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'exportation des paramètres:", error);
      return false;
    }
  };
  
  // Importer les paramètres
  const importSettings = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const importedSettings = JSON.parse(text);
      
      // Validation de base des paramètres importés
      if (typeof importedSettings !== 'object') {
        toast.error("Format de fichier invalide");
        return false;
      }
      
      // Appliquer les paramètres importés
      updateSettings(importedSettings);
      
      // Mettre à jour également le sessionStorage pour partage
      if (importedSettings.logo) {
        sessionStorage.setItem('shared_site_logo', importedSettings.logo);
      }
      
      if (importedSettings.favicon) {
        sessionStorage.setItem('shared_site_favicon', importedSettings.favicon);
      }
      
      console.log("Paramètres importés avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'importation des paramètres:", error);
      return false;
    }
  };
  
  return {
    exportSettings,
    importSettings
  };
};
