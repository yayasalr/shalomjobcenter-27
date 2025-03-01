
import { useState, useCallback, useRef, useEffect } from 'react';
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings';
import { toast } from "sonner";

export function useAdminSettings() {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSiteSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [logoUrl, setLogoUrl] = useState<string>(settings.logo || "/placeholder.svg");
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string>(settings.favicon || "/favicon.ico");
  const [faviconUploading, setFaviconUploading] = useState(false);
  
  // Synchronize local state with settings when they change
  useEffect(() => {
    if (settings.logo) {
      setLogoUrl(settings.logo);
    }
    if (settings.favicon) {
      setFaviconUrl(settings.favicon);
    }
  }, [settings.logo, settings.favicon]);

  const handleLogoUpload = useCallback((file: File) => {
    setLogoUploading(true);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setLogoUrl(previewUrl);
    
    // Simulate upload (in a real app, you would upload to a server)
    setTimeout(() => {
      // In a real application, you would get the URL from your backend
      const newLogoUrl = "/lovable-uploads/be3553b7-65a1-46ed-a1cf-4ad67b03a0c2.png";
      
      // Update state and settings
      setLogoUrl(newLogoUrl);
      updateSettings({ logo: newLogoUrl });
      setLogoUploading(false);
      
      // Clean up the object URL to avoid memory leaks
      URL.revokeObjectURL(previewUrl);
      
      toast.success("Logo mis à jour avec succès");
    }, 1500);
  }, [updateSettings]);

  const handleFaviconUpload = useCallback((file: File) => {
    setFaviconUploading(true);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setFaviconUrl(previewUrl);
    
    // Simulate upload
    setTimeout(() => {
      const newFaviconUrl = "/lovable-uploads/740ff73c-9223-468f-941b-578d7b960c2d.png";
      
      // Update state and settings
      setFaviconUrl(newFaviconUrl);
      updateSettings({ favicon: newFaviconUrl });
      setFaviconUploading(false);
      
      // Clean up the object URL
      URL.revokeObjectURL(previewUrl);
      
      toast.success("Favicon mis à jour avec succès");
    }, 1500);
  }, [updateSettings]);

  const handleImportClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const success = await importSettings(file);

    if (success) {
      toast.success("Paramètres importés avec succès");
    } else {
      toast.error("Échec de l'importation des paramètres");
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [importSettings]);

  const handleSettingsExport = useCallback(() => {
    const success = exportSettings();
    if (success) {
      toast.success("Paramètres exportés avec succès");
    } else {
      toast.error("Échec de l'exportation des paramètres");
    }
  }, [exportSettings]);

  const handleThemeColorChange = useCallback((type: 'primaryColor' | 'secondaryColor', color: string) => {
    updateSettings({ [type]: color });
    toast.success(`Couleur ${type === 'primaryColor' ? 'principale' : 'secondaire'} mise à jour`);
  }, [updateSettings]);

  const handleInputChange = useCallback((field: keyof SiteSettings, value: any) => {
    updateSettings({ [field]: value });
  }, [updateSettings]);

  const handleFooterChange = useCallback((field: keyof SiteSettings['footer'], value: string) => {
    updateSettings({
      footer: { ...settings.footer, [field]: value }
    });
  }, [settings.footer, updateSettings]);

  const handleCompanyInfoChange = useCallback((field: keyof SiteSettings['companyInfo'], value: string) => {
    updateSettings({
      companyInfo: { ...settings.companyInfo, [field]: value }
    });
  }, [settings.companyInfo, updateSettings]);

  const handleSocialLinkChange = useCallback((field: keyof SiteSettings['socialLinks'], value: string) => {
    updateSettings({
      socialLinks: { ...settings.socialLinks, [field]: value }
    });
  }, [settings.socialLinks, updateSettings]);

  const handleReset = useCallback(() => {
    resetSettings();
    setLogoUrl(settings.logo || "/placeholder.svg");
    setFaviconUrl(settings.favicon || "/favicon.ico");
    toast.success("Paramètres réinitialisés avec succès");
  }, [resetSettings, settings.logo, settings.favicon]);

  return {
    settings,
    activeTab,
    setActiveTab,
    logoUrl,
    logoUploading,
    faviconUrl,
    faviconUploading,
    fileInputRef,
    handleLogoUpload,
    handleFaviconUpload,
    handleImportClick,
    handleFileChange,
    handleSettingsExport,
    handleThemeColorChange,
    handleInputChange,
    handleFooterChange,
    handleCompanyInfoChange,
    handleSocialLinkChange,
    handleReset
  };
}
