
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Toast } from '@/components/ui/toast';
import { CheckCircle, ChevronLeft } from "lucide-react";
import { useSettingsActions } from './hooks/useSettingsActions';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from "@/components/ui/sidebar";

// Import tab components
import { SettingsTabs } from './SettingsTabs';
import { SettingsHeader } from './SettingsHeader';

export const AdminSettingsContainer = () => {
  const {
    settings,
    isSaving,
    showSuccessToast,
    handleSaveSettings
  } = useSettingsActions();
  
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showTabsContent, setShowTabsContent] = useState(true);
  
  // Observer la largeur de l'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowTabsContent(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] overflow-x-hidden">
        <AdminSidebar />
        <div className="flex flex-col">
          <AdminTopbar />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-x-hidden">
            {isMobileView && !showTabsContent && (
              <div className="mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-2"
                  onClick={() => setShowTabsContent(true)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Retour aux paramètres
                </Button>
              </div>
            )}
            
            <SettingsHeader 
              isSaving={isSaving} 
              handleSaveSettings={handleSaveSettings} 
            />
            
            <div className="overflow-x-auto">
              <SettingsTabs 
                settings={settings} 
                isMobileView={isMobileView}
                showTabsContent={showTabsContent}
                setShowTabsContent={setShowTabsContent}
              />
            </div>
            
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
    </SidebarProvider>
  );
};
