
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings';
import { BackButton } from '@/components/shared/BackButton';

// Import our new components
import { GeneralSettingsTab } from '@/components/admin/settings/GeneralSettingsTab';
import { ThemeSettingsTab } from '@/components/admin/settings/ThemeSettingsTab';
import { FooterSettingsTab } from '@/components/admin/settings/FooterSettingsTab';
import { CompanySettingsTab } from '@/components/admin/settings/CompanySettingsTab';
import { SocialSettingsTab } from '@/components/admin/settings/SocialSettingsTab';
import { ImportExportTab } from '@/components/admin/settings/ImportExportTab';

const AdminSettings = () => {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSiteSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [logoUrl, setLogoUrl] = useState<string>(settings.logo || "/placeholder.svg");
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string>(settings.favicon || "/favicon.ico");
  const [faviconUploading, setFaviconUploading] = useState(false);
  
  // Synchroniser l'état local avec les paramètres chaque fois qu'ils changent
  useEffect(() => {
    if (settings.logo) {
      setLogoUrl(settings.logo);
    }
    if (settings.favicon) {
      setFaviconUrl(settings.favicon);
    }
  }, [settings.logo, settings.favicon]);

  const handleLogoUpload = (file: File) => {
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
  };

  const handleFaviconUpload = (file: File) => {
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
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSettingsExport = () => {
    const success = exportSettings();
    if (success) {
      toast.success("Paramètres exportés avec succès");
    } else {
      toast.error("Échec de l'exportation des paramètres");
    }
  };

  const handleThemeColorChange = (type: 'primaryColor' | 'secondaryColor', color: string) => {
    updateSettings({ [type]: color });
    toast.success(`Couleur ${type === 'primaryColor' ? 'principale' : 'secondaire'} mise à jour`);
  };

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    updateSettings({ [field]: value });
  };

  const handleFooterChange = (field: keyof SiteSettings['footer'], value: string) => {
    updateSettings({
      footer: { ...settings.footer, [field]: value }
    });
  };

  const handleCompanyInfoChange = (field: keyof SiteSettings['companyInfo'], value: string) => {
    updateSettings({
      companyInfo: { ...settings.companyInfo, [field]: value }
    });
  };

  const handleSocialLinkChange = (field: keyof SiteSettings['socialLinks'], value: string) => {
    updateSettings({
      socialLinks: { ...settings.socialLinks, [field]: value }
    });
  };

  const handleReset = () => {
    resetSettings();
    setLogoUrl(settings.logo || "/placeholder.svg");
    setFaviconUrl(settings.favicon || "/favicon.ico");
    toast.success("Paramètres réinitialisés avec succès");
  };
  
  return (
    <div className="container mx-auto px-4 py-24">
      <BackButton />
      <h1 className="text-3xl font-bold mb-8">Paramètres du site</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 flex flex-wrap gap-2">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="theme">Thème</TabsTrigger>
          <TabsTrigger value="footer">Pied de page</TabsTrigger>
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
          <TabsTrigger value="importExport">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettingsTab 
            settings={settings} 
            handleInputChange={handleInputChange} 
          />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeSettingsTab 
            settings={settings}
            logoUrl={logoUrl}
            logoUploading={logoUploading}
            faviconUrl={faviconUrl}
            faviconUploading={faviconUploading}
            handleLogoUpload={handleLogoUpload}
            handleFaviconUpload={handleFaviconUpload}
            handleThemeColorChange={handleThemeColorChange}
            handleInputChange={handleInputChange}
          />
        </TabsContent>

        <TabsContent value="footer">
          <FooterSettingsTab 
            settings={settings} 
            handleFooterChange={handleFooterChange} 
          />
        </TabsContent>

        <TabsContent value="company">
          <CompanySettingsTab 
            settings={settings} 
            handleCompanyInfoChange={handleCompanyInfoChange} 
          />
        </TabsContent>

        <TabsContent value="social">
          <SocialSettingsTab 
            settings={settings} 
            handleSocialLinkChange={handleSocialLinkChange} 
          />
        </TabsContent>

        <TabsContent value="importExport">
          <ImportExportTab 
            handleImportClick={handleImportClick}
            handleSettingsExport={handleSettingsExport}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button variant="destructive" onClick={handleReset}>Réinitialiser les paramètres</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
