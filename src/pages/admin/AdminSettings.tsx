
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BackButton } from '@/components/shared/BackButton';
import { useAdminSettings } from '@/components/admin/settings/useAdminSettings';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Loader2, Save, CheckCircle } from "lucide-react";
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

import { GeneralSettingsTab } from '@/components/admin/settings/GeneralSettingsTab';
import { ThemeSettingsTab } from '@/components/admin/settings/ThemeSettingsTab';
import { FooterSettingsTab } from '@/components/admin/settings/FooterSettingsTab';
import { CompanySettingsTab } from '@/components/admin/settings/CompanySettingsTab';
import { SocialSettingsTab } from '@/components/admin/settings/SocialSettingsTab';
import { ImportExportTab } from '@/components/admin/settings/ImportExportTab';
import { NotificationSettingsTab } from '@/components/admin/settings/NotificationSettingsTab';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const AdminSettings = () => {
  const {
    settings,
    handleInputChange,
    handleFooterChange,
    handleCompanyInfoChange,
    handleSocialLinkChange,
    handleReset,
    goBackToDashboard,
    logoUrl,
    logoUploading,
    faviconUrl,
    faviconUploading,
    handleLogoUpload,
    handleFaviconUpload,
    handleThemeColorChange
  } = useAdminSettings();
  
  // Get the additional functions directly from useSiteSettings
  const { 
    updateSettings, 
    resetSettings, 
    exportSettings, 
    importSettings, 
    applySettingsToDOM 
  } = useSiteSettings();
  
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleChange = (field: keyof typeof settings, value: any) => {
    updateSettings({ [field]: value });
  };
  
  const handleNestedChange = (parent: keyof typeof settings, field: string, value: any) => {
    if (typeof settings[parent] === 'object') {
      updateSettings({
        [parent]: {
          ...settings[parent],
          [field]: value
        }
      });
    }
  };
  
  const handleSocialLinksChange = (field: keyof (typeof settings)['socialLinks'], value: string) => {
    updateSettings({
      socialLinks: { ...settings.socialLinks, [field]: value }
    });
  };
  
  const handleImportSettings = async (file: File) => {
    return await importSettings(file);
  };
  
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
  
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <AdminTopbar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Paramètres du site</h1>
            <Button 
              variant="outline" 
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
          
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
                handleSocialLinkChange={handleSocialLinkChange}
              />
            </TabsContent>
            
            <TabsContent value="notification">
              <NotificationSettingsTab 
                settings={settings} 
                handleChange={handleChange} 
                handleNestedChange={handleNestedChange}
              />
            </TabsContent>
            
            <TabsContent value="import-export">
              <ImportExportTab 
                onImport={handleImportSettings}
                onExport={exportSettings}
              />
            </TabsContent>
          </Tabs>
          
          {showSuccessToast && (
            <Toast>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Paramètres enregistrés avec succès
              </div>
            </Toast>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
