
import { SiteSettings } from '@/types/siteSettings';
import { validateSettings } from '@/utils/siteSettings/validateSettings';
import { toast } from 'sonner';

export const useSettingsExportImport = (
  settings: SiteSettings,
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>
) => {
  // Exporter les paramètres
  const exportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `site-settings-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Paramètres exportés avec succès');
      return true;
    } catch (err) {
      console.error('Erreur lors de l\'exportation des paramètres:', err);
      toast.error('Erreur lors de l\'exportation des paramètres');
      return false;
    }
  };

  // Importer les paramètres
  const importSettings = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const importedSettings = JSON.parse(content);
          
          // Valider les paramètres importés
          const validatedSettings = validateSettings(importedSettings);
          
          // Mettre à jour les paramètres
          await updateSettings(validatedSettings);
          
          toast.success('Paramètres importés avec succès');
          resolve(true);
        } catch (err) {
          console.error('Erreur lors de l\'importation des paramètres:', err);
          toast.error('Erreur lors de l\'importation des paramètres');
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Erreur lors de la lecture du fichier');
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  };
  
  return {
    exportSettings,
    importSettings
  };
};
