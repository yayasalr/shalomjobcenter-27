
import { useState, useEffect } from 'react';
import { useAdminSettings } from '@/components/admin/settings/useAdminSettings';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { SiteSettings } from '@/types/siteSettings';

export const useTabsManagement = (settings: SiteSettings) => {
  const {
    logoUrl,
    logoUploading,
    faviconUrl,
    faviconUploading,
    handleLogoUpload,
    handleFaviconUpload,
    handleThemeColorChange,
    handleInputChange,
    handleFooterChange,
    handleCompanyInfoChange,
    handleSocialLinkChange,
  } = useAdminSettings();

  const { 
    importSettings: importSettingsFunc, 
    exportSettings: exportSettingsFunc
  } = useSiteSettings();

  const handleSocialLinksChange = (field: keyof SiteSettings['socialLinks'], value: string) => {
    handleSocialLinkChange(field, value);
  };

  const handleNestedChange = (parent: keyof SiteSettings, field: string, value: any) => {
    // Access the parent object from settings
    if (typeof settings[parent] === 'object') {
      // Create updated object
      const updatedValue = {
        ...settings[parent],
        [field]: value
      };
      
      // Update using the input change handler
      handleInputChange(parent, updatedValue);
    }
  };

  // Use importSettings and exportSettings from useSiteSettings
  const importSettings = async (file: File) => {
    return await importSettingsFunc(file);
  };
  
  const exportSettings = () => {
    return exportSettingsFunc();
  };

  return {
    logoUrl,
    logoUploading,
    faviconUrl,
    faviconUploading,
    handleLogoUpload,
    handleFaviconUpload,
    handleThemeColorChange,
    handleInputChange,
    handleFooterChange,
    handleCompanyInfoChange,
    handleSocialLinksChange,
    handleNestedChange,
    importSettings,
    exportSettings
  };
};
