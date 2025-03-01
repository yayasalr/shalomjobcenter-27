
import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';

export const useSettingsActions = () => {
  const { 
    settings, 
    updateSettings, 
    resetSettings, 
    exportSettings, 
    importSettings, 
    applySettingsToDOM 
  } = useSiteSettings();
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Ensure settings are applied to DOM on mount
  useEffect(() => {
    applySettingsToDOM();
  }, []);
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Sauvegarde explicite dans localStorage
      localStorage.setItem('siteSettings', JSON.stringify(settings));
      
      // Si le logo ou favicon est en data URL, assurez-vous qu'ils sont stockés séparément
      if (settings.logo && settings.logo.startsWith('data:')) {
        localStorage.setItem('site_logo', settings.logo);
      }
      
      if (settings.favicon && settings.favicon.startsWith('data:')) {
        localStorage.setItem('site_favicon', settings.favicon);
      }
      
      // Appliquer les paramètres au DOM
      applySettingsToDOM();
      
      // Simuler l'API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccessToast(true);
      toast.success("Paramètres enregistrés avec succès");
      
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres:", error);
      toast.error("Erreur lors de la sauvegarde des paramètres");
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    settings,
    isSaving,
    showSuccessToast,
    handleSaveSettings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings
  };
};
