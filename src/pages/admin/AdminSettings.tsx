
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

const AdminSettings = () => {
  const {
    settings,
    updateSettings,
    handleCompanyInfoChange,
    resetSettings,
    exportSettings,
    importSettings,
    applySettingsToDOM
  } = useAdminSettings();
  
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(settings.logo || "/placeholder.svg");
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string>(settings.favicon || "/favicon.ico");
  const [faviconUploading, setFaviconUploading] = useState(false);
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
  
  const handleFooterChange = (field: keyof (typeof settings)['footer'], value: string) => {
    updateSettings({
      footer: { ...settings.footer, [field]: value }
    });
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
  
  const handleLogoUpload = (file: File) => {
    setLogoUploading(true);
    
    // Create a preview URL and apply it immediately to see the change
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target?.result as string;
      
      if (result) {
        // Update locally and in settings immediately
        setLogoUrl(result);
        updateSettings({ logo: result });
        
        // Then simulate the server upload for persistent storage
        setTimeout(() => {
          // Store in localStorage for persistence
          try {
            localStorage.setItem('site_logo', result);
          } catch (error) {
            console.error("Error storing logo:", error);
          }
          
          setLogoUploading(false);
        }, 1000);
      }
    };
    
    fileReader.readAsDataURL(file);
  };

  const handleFaviconUpload = (file: File) => {
    setFaviconUploading(true);
    
    // Create a preview URL and apply it immediately
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target?.result as string;
      
      if (result) {
        // Update locally and in settings immediately
        setFaviconUrl(result);
        updateSettings({ favicon: result });
        
        // Then simulate the server upload
        setTimeout(() => {
          // Store in localStorage for persistence
          try {
            localStorage.setItem('site_favicon', result);
          } catch (error) {
            console.error("Error storing favicon:", error);
          }
          
          setFaviconUploading(false);
        }, 1000);
      }
    };
    
    fileReader.readAsDataURL(file);
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
    await handleImportSettings(file);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const goBackToDashboard = () => {
    window.location.href = '/admin';
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
                handleChange={handleChange} 
                handleNestedChange={handleNestedChange}
              />
            </TabsContent>
            
            <TabsContent value="theme">
              <ThemeSettingsTab 
                settings={settings} 
                handleChange={handleChange} 
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
