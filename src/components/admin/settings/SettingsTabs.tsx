
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
import { ContentSettingsTab } from './ContentSettingsTab';

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
    <Tabs defaultValue="general" className="w-full overflow-x-auto">
      <div className="w-full overflow-x-auto pb-2">
        <TabsList className="grid md:grid-cols-8 grid-cols-4 md:grid-rows-1 grid-rows-2 h-auto mb-2 w-full">
          <TabsTrigger value="general" className="text-xs md:text-sm">Général</TabsTrigger>
          <TabsTrigger value="theme" className="text-xs md:text-sm">Apparence</TabsTrigger>
          <TabsTrigger value="company" className="text-xs md:text-sm">Entreprise</TabsTrigger>
          <TabsTrigger value="footer" className="text-xs md:text-sm">Pied de page</TabsTrigger>
          <TabsTrigger value="social" className="text-xs md:text-sm">Réseaux sociaux</TabsTrigger>
          <TabsTrigger value="notification" className="text-xs md:text-sm">Notifications</TabsTrigger>
          <TabsTrigger value="content" className="text-xs md:text-sm">Contenu</TabsTrigger>
          <TabsTrigger value="import-export" className="text-xs md:text-sm">Import/Export</TabsTrigger>
        </TabsList>
      </div>
      
      <div className="overflow-x-hidden mt-4">
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
        
        <TabsContent value="content">
          <ContentSettingsTab />
        </TabsContent>
        
        <TabsContent value="import-export">
          <ImportExportTab 
            onImport={importSettings}
            onExport={exportSettings}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};
