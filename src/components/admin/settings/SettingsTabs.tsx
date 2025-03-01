
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SiteSettings } from '@/types/siteSettings';

// Import all tab components
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { ThemeSettingsTab } from './ThemeSettingsTab';
import { FooterSettingsTab } from './FooterSettingsTab';
import { CompanySettingsTab } from './CompanySettingsTab';
import { SocialSettingsTab } from './SocialSettingsTab';
import { ImportExportTab } from './ImportExportTab';
import { NotificationSettingsTab } from './NotificationSettingsTab';

// Import the hook for settings management
import { useTabsManagement } from './hooks/useTabsManagement';

interface SettingsTabsProps {
  settings: SiteSettings;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ settings }) => {
  const {
    handleInputChange,
    handleFooterChange,
    handleCompanyInfoChange,
    handleSocialLinksChange,
    handleNestedChange,
    handleThemeColorChange,
    logoUrl,
    logoUploading,
    faviconUrl,
    faviconUploading,
    handleLogoUpload,
    handleFaviconUpload,
    importSettings,
    exportSettings
  } = useTabsManagement(settings);

  return (
    <Tabs defaultValue="general">
      <TabsList className="grid md:grid-cols-7 grid-cols-2 md:grid-rows-1 grid-rows-4 h-auto mb-2">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="theme">Apparence</TabsTrigger>
        <TabsTrigger value="company">Entreprise</TabsTrigger>
        <TabsTrigger value="footer">Pied de page</TabsTrigger>
        <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
        <TabsTrigger value="notification">Notifications</TabsTrigger>
        <TabsTrigger value="import-export">Import/Export</TabsTrigger>
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
      
      <TabsContent value="company">
        <CompanySettingsTab 
          settings={settings} 
          handleCompanyInfoChange={handleCompanyInfoChange} 
        />
      </TabsContent>
      
      <TabsContent value="footer">
        <FooterSettingsTab 
          settings={settings} 
          handleFooterChange={handleFooterChange} 
        />
      </TabsContent>
      
      <TabsContent value="social">
        <SocialSettingsTab 
          settings={settings} 
          handleSocialLinkChange={handleSocialLinksChange}
        />
      </TabsContent>
      
      <TabsContent value="notification">
        <NotificationSettingsTab 
          settings={settings} 
          handleChange={handleInputChange} 
          handleNestedChange={handleNestedChange}
        />
      </TabsContent>
      
      <TabsContent value="import-export">
        <ImportExportTab 
          onImport={importSettings}
          onExport={exportSettings}
        />
      </TabsContent>
    </Tabs>
  );
};
