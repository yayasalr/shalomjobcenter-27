
import { useState } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

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
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      // Apply settings to DOM
      applySettingsToDOM();
      setIsSaving(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
    }, 1000);
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
