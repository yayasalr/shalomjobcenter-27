
import { useState, useCallback, useEffect } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { defaultSettings } from './useSettingsDefaults';
import { useSettingsDatabase } from './useSettingsDatabase';
import { useSettingsUI } from './useSettingsUI';
import { useSettingsExportImport } from './useSettingsExportImport';
import { useCompanyInfoManagement } from './useCompanyInfoManagement';
import { toast } from 'sonner';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings as SiteSettings);
  
  const {
    loading: dbLoading,
    error: dbError,
    fetchSettings,
    updateSettingsInDatabase,
    resetSettingsInDatabase
  } = useSettingsDatabase();
  
  const { applySettingsToDOM } = useSettingsUI(settings);
  
  const { handleCompanyInfoChange } = useCompanyInfoManagement(settings, setSettings);

  // Charger les paramètres au démarrage
  useEffect(() => {
    const loadSettings = async () => {
      const loadedSettings = await fetchSettings();
      setSettings(loadedSettings);
    };
    
    loadSettings();
  }, [fetchSettings]);

  // Appliquer les paramètres au DOM lorsqu'ils changent
  useEffect(() => {
    applySettingsToDOM();
  }, [settings, applySettingsToDOM]);

  // Mettre à jour les paramètres
  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    try {
      // Préparer les données à mettre à jour
      const updatedSettings = { ...settings, ...newSettings };
      
      // Mettre à jour l'état local
      setSettings(updatedSettings);
      
      // Mettre à jour dans Supabase
      const success = await updateSettingsInDatabase(updatedSettings);
      
      if (success) {
        toast.success('Paramètres mis à jour avec succès');
      }
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour des paramètres:', err);
      toast.error(err.message || 'Erreur lors de la mise à jour des paramètres');
    }
  }, [settings, updateSettingsInDatabase]);

  // Réinitialiser les paramètres
  const resetSettings = useCallback(async () => {
    try {
      // Réinitialiser l'état local
      setSettings(defaultSettings as SiteSettings);
      
      // Réinitialiser dans Supabase
      const success = await resetSettingsInDatabase();
      
      if (success) {
        toast.success('Paramètres réinitialisés avec succès');
      }
    } catch (err: any) {
      console.error('Erreur lors de la réinitialisation des paramètres:', err);
      toast.error(err.message || 'Erreur lors de la réinitialisation des paramètres');
    }
  }, [resetSettingsInDatabase]);

  // Import/Export functionality
  const { 
    exportSettings, 
    importSettings 
  } = useSettingsExportImport(settings, updateSettings);

  // Recharger les paramètres
  const loadSettings = useCallback(async () => {
    const loadedSettings = await fetchSettings();
    setSettings(loadedSettings);
    applySettingsToDOM();
  }, [fetchSettings, applySettingsToDOM]);

  return {
    settings,
    loading: dbLoading,
    error: dbError,
    updateSettings,
    resetSettings,
    loadSettings,
    handleCompanyInfoChange,
    exportSettings,
    importSettings,
    applySettingsToDOM
  };
};
