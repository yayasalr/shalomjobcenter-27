
import React, { useState } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { AdminSettingsHeader } from './AdminSettingsHeader';
import { AdminSettingsMobile } from './AdminSettingsMobile';
import { AdminSettingsDesktop } from './AdminSettingsDesktop';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const AdminSettingsContainer: React.FC = () => {
  const { settings, updateSettings, resetSettings, loading, error } = useSiteSettings();
  const [showMobileContent, setShowMobileContent] = useState(false);

  // Gérer l'état de chargement
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="ml-3 text-lg text-gray-600">Chargement des paramètres...</p>
      </div>
    );
  }

  // Gérer l'état d'erreur
  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 max-w-md w-full">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSettingsHeader 
        settings={settings}
        resetSettings={resetSettings}
        isMobileView={false}
        showMobileContent={showMobileContent}
        setShowMobileContent={setShowMobileContent}
      />
      
      <div className="container mx-auto px-4 pb-12">
        {/* Version mobile */}
        <div className="md:hidden">
          <AdminSettingsMobile 
            settings={settings}
            showMobileContent={showMobileContent}
            setShowMobileContent={setShowMobileContent}
          />
        </div>
        
        {/* Version desktop */}
        <div className="hidden md:block">
          <AdminSettingsDesktop settings={settings} />
        </div>
      </div>
    </div>
  );
};
