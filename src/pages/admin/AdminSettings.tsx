import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BackButton } from '@/components/shared/BackButton';
import { useAdminSettings } from '@/components/admin/settings/useAdminSettings';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Loader2, Save, CheckCircle } from '@/components/ui/icons';
import { Toast } from '@/components/ui/toast';

import { GeneralSettingsTab } from '@/components/admin/settings/GeneralSettingsTab';
import { ThemeSettingsTab } from '@/components/admin/settings/ThemeSettingsTab';
import { FooterSettingsTab } from '@/components/admin/settings/FooterSettingsTab';
import { CompanySettingsTab } from '@/components/admin/settings/CompanySettingsTab';
import { SocialSettingsTab } from '@/components/admin/settings/SocialSettingsTab';
import { ImportExportTab } from '@/components/admin/settings/ImportExportTab';
import { NotificationSettingsTab } from '@/components/admin/settings/NotificationSettingsTab';

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
    goBackToDashboard,
    isSaving,
    handleSaveSettings,
    handleChange,
    handleNestedChange,
    handleSocialLinksChange,
    handleImportSettings,
    showSuccessToast
  } = useAdminSettings();
  
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
                handleChange={handleChange} 
                handleNestedChange={handleNestedChange}
              />
            </TabsContent>
            
            <TabsContent value="theme">
              <ThemeSettingsTab settings={settings} handleChange={handleChange} />
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
                handleSocialLinksChange={handleSocialLinksChange}
                handleChange={handleChange}
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
                settings={settings}
                handleImportSettings={handleImportSettings}
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
