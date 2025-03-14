
import { useCallback } from 'react';
import { SiteSettings } from '@/types/siteSettings';

export const useCompanyInfoManagement = (
  settings: SiteSettings,
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>
) => {
  // Fonction pour gérer le changement des informations de l'entreprise
  const handleCompanyInfoChange = useCallback((field: keyof SiteSettings['companyInfo'], value: string) => {
    setSettings(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }));
  }, [setSettings]);

  return {
    handleCompanyInfoChange
  };
};
