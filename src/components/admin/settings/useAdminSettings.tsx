
import { useState, useCallback, useRef, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { SiteSettings } from '@/types/siteSettings';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

export function useAdminSettings() {
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [logoUrl, setLogoUrl] = useState<string>(settings.logo || "/lovable-uploads/840dfb44-1c4f-4475-9321-7f361be73327.png");
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string>(settings.favicon || "/favicon.ico");
  const [faviconUploading, setFaviconUploading] = useState(false);
  const navigate = useNavigate();
  
  // Synchronize local state with settings when they change
  useEffect(() => {
    if (settings.logo) {
      setLogoUrl(settings.logo);
    }
    
    if (settings.favicon) {
      setFaviconUrl(settings.favicon);
    }
  }, [settings.logo, settings.favicon]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setLogoUploading(true);
    
    // Create a preview URL and apply it immediately to see the change
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target?.result as string;
      
      if (result) {
        // Update locally for UI
        setLogoUrl(result);
        
        // Store in settings
        updateSettings({ logo: result });
        
        // Also share with sessionStorage for cross-tab access
        sessionStorage.setItem('shared_site_logo', result);
        
        // Then simulate the server upload for persistent storage
        setTimeout(() => {
          setLogoUploading(false);
          toast.success("Logo mis à jour avec succès");
        }, 1000);
      }
    };
    
    fileReader.readAsDataURL(file);
  }, [updateSettings]);

  const handleFaviconUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setFaviconUploading(true);
    
    // Create a preview URL and apply it immediately
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target?.result as string;
      
      if (result) {
        // Update locally for UI
        setFaviconUrl(result);
        
        // Store in settings
        updateSettings({ favicon: result });
        
        // Also share with sessionStorage for cross-tab access
        sessionStorage.setItem('shared_site_favicon', result);
        
        // Then simulate the server upload
        setTimeout(() => {
          setFaviconUploading(false);
          toast.success("Favicon mis à jour avec succès");
        }, 1000);
      }
    };
    
    fileReader.readAsDataURL(file);
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
    try {
      const text = await file.text();
      const importedSettings = JSON.parse(text);
      updateSettings(importedSettings);
      toast.success("Paramètres importés avec succès");
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      toast.error("Échec de l'importation des paramètres");
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [updateSettings]);

  const handleSettingsExport = useCallback(() => {
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
      
      toast.success("Paramètres exportés avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      toast.error("Échec de l'exportation des paramètres");
      return false;
    }
  }, [settings]);

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
    
    // Synchronize local state with reset settings
    const defaultLogo = "/lovable-uploads/840dfb44-1c4f-4475-9321-7f361be73327.png";
    const defaultFavicon = "/favicon.ico";
    setLogoUrl(defaultLogo);
    setFaviconUrl(defaultFavicon);
    
    toast.success("Paramètres réinitialisés avec succès");
  }, [resetSettings]);
  
  const goBackToDashboard = useCallback(() => {
    navigate('/admin');
  }, [navigate]);

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
    handleReset,
    goBackToDashboard
  };
}
