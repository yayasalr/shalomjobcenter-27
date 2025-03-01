
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BackButton } from '@/components/shared/BackButton';
import { useAdminSettings } from '@/components/admin/settings/useAdminSettings';

// Import our tab components
import { GeneralSettingsTab } from '@/components/admin/settings/GeneralSettingsTab';
import { ThemeSettingsTab } from '@/components/admin/settings/ThemeSettingsTab';
import { FooterSettingsTab } from '@/components/admin/settings/FooterSettingsTab';
import { CompanySettingsTab } from '@/components/admin/settings/CompanySettingsTab';
import { SocialSettingsTab } from '@/components/admin/settings/SocialSettingsTab';
import { ImportExportTab } from '@/components/admin/settings/ImportExportTab';

const AdminSettings = () => {
  const {
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
  } = useAdminSettings();
  
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={goBackToDashboard}
          className="mb-4"
        >
          Retour au tableau de bord
        </Button>
        <h1 className="text-3xl font-bold">Paramètres du site</h1>
      </div>

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
